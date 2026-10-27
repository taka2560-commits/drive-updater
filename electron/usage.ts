// 容量分析: フォルダ（ドライブ全体も可）を走査し、フォルダごとのサイズ・件数・拡張子の内訳を集計する。
// 結果は userData/usage に圧縮保存し、次回は再走査せずに即表示できるようにする。
import { app, ipcMain, type WebContents } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { createLimiter } from './limiter';

interface Node {
  name: string;
  bytes: number; // 配下すべての合計
  files: number; // 配下すべてのファイル数
  dirs: number; // 配下すべてのフォルダ数
  own: Record<string, [number, number]>; // 直下のファイルのみ: 拡張子 → [件数, バイト]
  kids: Node[];
}

interface BigFile {
  path: string;
  bytes: number;
  modifiedAt: number;
}

interface Analysis {
  root: string;
  scannedAt: number;
  inaccessible: number;
  tree: Node;
  largest: BigFile[];
}

export interface UsageSummary {
  root: string;
  scannedAt: number;
  bytes: number;
  files: number;
}

const LARGEST_KEEP = 500;
const SAVED_MAX = 5;
const DIR_WORKERS = 8;

const usageDir = () => path.join(app.getPath('userData'), 'usage');
const indexFile = () => path.join(usageDir(), 'index.json');
const fileFor = (root: string) =>
  path.join(usageDir(), crypto.createHash('sha1').update(root).digest('hex').slice(0, 16) + '.json.gz');

const newNode = (name: string): Node => ({ name, bytes: 0, files: 0, dirs: 0, own: {}, kids: [] });

// --- 走査 ---------------------------------------------------------------

interface Job {
  root: string;
  canceled: boolean;
  files: number;
  bytes: number;
  dirs: number;
  inaccessible: number;
  current: string;
  largest: BigFile[];
}

function progressOf(job: Job) {
  return { root: job.root, files: job.files, bytes: job.bytes, dirs: job.dirs, current: job.current };
}

function keepLargest(job: Job, f: BigFile) {
  job.largest.push(f);
  if (job.largest.length > LARGEST_KEEP * 2) {
    job.largest.sort((a, b) => b.bytes - a.bytes);
    job.largest.length = LARGEST_KEEP;
  }
}

/** Breadth-first with a few directory workers, so a whole drive never piles up pending work. */
async function walk(rootPath: string, job: Job): Promise<Node> {
  const limit = createLimiter(32);
  const root = newNode(rootPath);
  const queue: { dir: string; node: Node }[] = [{ dir: rootPath, node: root }];

  const processDir = async ({ dir, node }: { dir: string; node: Node }) => {
    if (job.canceled) return;
    job.current = dir;
    let entries: fs.Dirent[];
    try {
      entries = await limit(() => fs.promises.readdir(dir, { withFileTypes: true }));
    } catch {
      job.inaccessible++;
      return;
    }
    await Promise.all(
      entries.map(async (d) => {
        if (job.canceled || d.isSymbolicLink()) return; // シンボリックリンク/ジャンクションは辿らない
        const full = path.join(dir, d.name);
        if (d.isDirectory()) {
          const child = newNode(d.name);
          node.kids.push(child);
          job.dirs++;
          queue.push({ dir: full, node: child });
          return;
        }
        if (!d.isFile()) return;
        let st: fs.Stats;
        try {
          st = await limit(() => fs.promises.stat(full));
        } catch {
          return; // 使用中のシステムファイルなど
        }
        const ext = path.extname(d.name).slice(1).toLowerCase();
        const o = (node.own[ext] ??= [0, 0]);
        o[0]++;
        o[1] += st.size;
        job.files++;
        job.bytes += st.size;
        keepLargest(job, { path: full, bytes: st.size, modifiedAt: st.mtimeMs });
      }),
    );
  };

  await new Promise<void>((resolve) => {
    let active = 0;
    const pump = () => {
      while (!job.canceled && active < DIR_WORKERS && queue.length > 0) {
        const task = queue.pop()!;
        active++;
        processDir(task).finally(() => {
          active--;
          pump();
        });
      }
      if (active === 0 && (queue.length === 0 || job.canceled)) resolve();
    };
    pump();
  });

  sumUp(root);
  return root;
}

/** Fill bytes/files/dirs bottom-up (iterative: deep trees must not overflow the stack). */
function sumUp(root: Node) {
  const order: Node[] = [];
  const stack = [root];
  while (stack.length) {
    const n = stack.pop()!;
    order.push(n);
    for (const k of n.kids) stack.push(k);
  }
  for (let i = order.length - 1; i >= 0; i--) {
    const n = order[i];
    let bytes = 0;
    let files = 0;
    for (const [c, b] of Object.values(n.own)) {
      files += c;
      bytes += b;
    }
    let dirs = n.kids.length;
    for (const k of n.kids) {
      bytes += k.bytes;
      files += k.files;
      dirs += k.dirs;
    }
    n.bytes = bytes;
    n.files = files;
    n.dirs = dirs;
  }
}

// --- 保存 / 読み込み ------------------------------------------------------

// Compact on disk: [name, [ext, count, bytes, ...], kids]. Totals are recomputed on load.
type Packed = [string, (string | number)[], Packed[]];

function pack(n: Node): Packed {
  const own: (string | number)[] = [];
  for (const [ext, [c, b]] of Object.entries(n.own)) own.push(ext, c, b);
  return [n.name, own, n.kids.map(pack)];
}

function unpack(p: Packed): Node {
  const n = newNode(p[0]);
  for (let i = 0; i < p[1].length; i += 3) n.own[p[1][i] as string] = [p[1][i + 1] as number, p[1][i + 2] as number];
  n.kids = p[2].map(unpack);
  return n;
}

function readIndex(): UsageSummary[] {
  try {
    return JSON.parse(fs.readFileSync(indexFile(), 'utf8')) as UsageSummary[];
  } catch {
    return [];
  }
}

async function save(a: Analysis) {
  await fs.promises.mkdir(usageDir(), { recursive: true });
  const body = JSON.stringify({
    root: a.root,
    scannedAt: a.scannedAt,
    inaccessible: a.inaccessible,
    largest: a.largest,
    tree: pack(a.tree),
  });
  await fs.promises.writeFile(fileFor(a.root), await new Promise<Buffer>((res, rej) =>
    zlib.gzip(body, (err, out) => (err ? rej(err) : res(out)))));

  const entry: UsageSummary = { root: a.root, scannedAt: a.scannedAt, bytes: a.tree.bytes, files: a.tree.files };
  const index = [entry, ...readIndex().filter((e) => e.root !== a.root)];
  for (const old of index.splice(SAVED_MAX)) await fs.promises.rm(fileFor(old.root), { force: true });
  await fs.promises.writeFile(indexFile(), JSON.stringify(index));
}

async function load(root: string): Promise<Analysis | null> {
  try {
    const gz = await fs.promises.readFile(fileFor(root));
    const raw = await new Promise<Buffer>((res, rej) => zlib.gunzip(gz, (err, out) => (err ? rej(err) : res(out))));
    const data = JSON.parse(raw.toString('utf8')) as Omit<Analysis, 'tree'> & { tree: Packed };
    const tree = unpack(data.tree);
    sumUp(tree);
    return { ...data, tree };
  } catch {
    return null;
  }
}

// Keep only the most recent analysis in memory; others are a quick load from disk.
let cached: Analysis | null = null;
async function getAnalysis(root: string): Promise<Analysis | null> {
  if (cached?.root === root) return cached;
  const a = await load(root);
  if (a) cached = a;
  return a;
}

// --- 問い合わせ -----------------------------------------------------------

function findNode(a: Analysis, target: string): Node | null {
  if (target === a.root) return a.tree;
  const rel = path.relative(a.root, target);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null;
  let n: Node | undefined = a.tree;
  for (const seg of rel.split(path.sep)) {
    n = n.kids.find((k) => k.name === seg);
    if (!n) return null;
  }
  return n;
}

function nodeView(a: Analysis, target: string) {
  const n = findNode(a, target);
  if (!n) return null;

  const exts = new Map<string, [number, number]>();
  const stack = [n];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const [ext, [c, b]] of Object.entries(cur.own)) {
      const e = exts.get(ext) ?? [0, 0];
      e[0] += c;
      e[1] += b;
      exts.set(ext, e);
    }
    for (const k of cur.kids) stack.push(k);
  }

  const prefix = target.endsWith(path.sep) ? target : target + path.sep;
  const largest = a.largest
    .filter((f) => target === a.root || f.path.startsWith(prefix))
    .sort((x, y) => y.bytes - x.bytes)
    .slice(0, 50)
    .map((f) => ({ ...f, name: path.basename(f.path) }));

  return {
    root: a.root,
    scannedAt: a.scannedAt,
    inaccessible: a.inaccessible,
    path: target,
    name: n === a.tree ? a.root : n.name,
    bytes: n.bytes,
    files: n.files,
    dirs: n.dirs,
    children: [...n.kids]
      .sort((x, y) => y.bytes - x.bytes)
      .map((k) => ({ name: k.name, path: path.join(target, k.name), bytes: k.bytes, files: k.files, dirs: k.dirs })),
    exts: [...exts.entries()].map(([ext, [c, b]]) => [ext, c, b] as [string, number, number]).sort((x, y) => y[2] - x[2]),
    largest,
  };
}

// --- IPC ------------------------------------------------------------------

let running: Job | null = null;

export function registerUsageIpc() {
  ipcMain.handle('usage-analyze', async (e, rootArg: string) => {
    if (typeof rootArg !== 'string' || !rootArg) return { error: 'invalid' };
    const root = path.resolve(rootArg);
    try {
      if (!(await fs.promises.stat(root)).isDirectory()) return { error: 'not-a-folder' };
    } catch {
      return { error: 'not-found' };
    }
    if (running) running.canceled = true;
    const job: Job = { root, canceled: false, files: 0, bytes: 0, dirs: 0, inaccessible: 0, current: root, largest: [] };
    running = job;

    const sender: WebContents = e.sender;
    const report = (done = false) => {
      if (!sender.isDestroyed()) sender.send('usage-progress', { ...progressOf(job), done });
    };
    const timer = setInterval(() => report(), 250);
    try {
      const tree = await walk(root, job);
      if (job.canceled) return { canceled: true };
      job.largest.sort((a, b) => b.bytes - a.bytes);
      job.largest.length = Math.min(job.largest.length, LARGEST_KEEP);
      const analysis: Analysis = { root, scannedAt: Date.now(), inaccessible: job.inaccessible, tree, largest: job.largest };
      cached = analysis;
      await save(analysis).catch(() => {}); // 保存に失敗しても今回の結果は表示できる
      return { ok: true, root, scannedAt: analysis.scannedAt };
    } finally {
      clearInterval(timer);
      if (running === job) running = null;
      report(true);
    }
  });

  // Lets the screen pick up an analysis that kept running while it was closed.
  ipcMain.handle('usage-status', () => (running ? progressOf(running) : null));

  ipcMain.handle('usage-cancel', () => {
    if (running) running.canceled = true;
  });

  ipcMain.handle('usage-node', async (_e, rootArg: string, target: string) => {
    if (typeof rootArg !== 'string' || typeof target !== 'string') return null;
    const root = path.resolve(rootArg);
    const a = await getAnalysis(root);
    return a ? nodeView(a, path.resolve(target)) : null;
  });

  ipcMain.handle('usage-list', () => readIndex());
}
