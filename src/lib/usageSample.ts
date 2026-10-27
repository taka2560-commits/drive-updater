// Fake disk-usage data for the browser preview (no Electron API), so the screen
// can be designed and tested without scanning a real disk.
import type { UsageAnalyzeResult, UsageNode, UsageProgress, UsageSummary } from '../types';

interface SampleDir {
  name: string;
  files: [name: string, bytes: number][];
  kids: SampleDir[];
}

const MB = 1_048_576;
const GB = 1024 * MB;

const ROOT = 'C:\\Users\\taka\\Documents';
const TREE: SampleDir = {
  name: ROOT,
  files: [['メモ.txt', 12_000], ['見積書.xlsx', 240_000]],
  kids: [
    {
      name: '動画素材',
      files: [['現場撮影_01.mp4', 2.4 * GB], ['現場撮影_02.mp4', 1.7 * GB], ['ナレーション.wav', 320 * MB]],
      kids: [{ name: '書き出し', files: [['完成版.mp4', 980 * MB]], kids: [] }],
    },
    {
      name: '図面',
      files: [['平面図.dwg', 48 * MB], ['断面図.dwg', 36 * MB], ['配置図.dxf', 22 * MB], ['図面一式.pdf', 64 * MB]],
      kids: [
        { name: '旧版', files: [['平面図_v1.dwg', 41 * MB], ['平面図_v2.dwg', 44 * MB]], kids: [] },
        { name: '写真', files: Array.from({ length: 24 }, (_, i) => [`IMG_${1000 + i}.jpg`, 4.2 * MB] as [string, number]), kids: [] },
      ],
    },
    {
      name: 'バックアップ',
      files: [['2025年度.zip', 1.1 * GB], ['2026年上期.zip', 760 * MB]],
      kids: [],
    },
    {
      name: '書類',
      files: [['報告書.docx', 2.1 * MB], ['議事録.docx', 0.4 * MB], ['提案資料.pptx', 18 * MB], ['集計.xlsx', 3.3 * MB]],
      kids: [],
    },
    { name: 'ツール', files: [['setup.exe', 140 * MB], ['viewer.msi', 62 * MB]], kids: [] },
  ],
};

const sep = '\\';
const extOf = (n: string) => (n.includes('.') ? n.slice(n.lastIndexOf('.') + 1).toLowerCase() : '');

function totals(d: SampleDir): { bytes: number; files: number; dirs: number } {
  let bytes = d.files.reduce((s, [, b]) => s + b, 0);
  let files = d.files.length;
  let dirs = d.kids.length;
  for (const k of d.kids) {
    const t = totals(k);
    bytes += t.bytes;
    files += t.files;
    dirs += t.dirs;
  }
  return { bytes, files, dirs };
}

function allFiles(d: SampleDir, at: string): { path: string; name: string; bytes: number }[] {
  return [
    ...d.files.map(([name, bytes]) => ({ path: at + sep + name, name, bytes })),
    ...d.kids.flatMap((k) => allFiles(k, at + sep + k.name)),
  ];
}

let scannedAt = Date.now() - 3 * 3_600_000;

function view(path: string): UsageNode | null {
  const rel = path === ROOT ? [] : path.slice(ROOT.length + 1).split(sep);
  let d: SampleDir | undefined = TREE;
  for (const seg of rel) {
    d = d.kids.find((k) => k.name === seg);
    if (!d) return null;
  }
  const files = allFiles(d, path);
  const exts = new Map<string, [number, number]>();
  for (const f of files) {
    const e = exts.get(extOf(f.name)) ?? [0, 0];
    e[0]++;
    e[1] += f.bytes;
    exts.set(extOf(f.name), e);
  }
  return {
    root: ROOT,
    scannedAt,
    inaccessible: 0,
    path,
    name: d === TREE ? ROOT : d.name,
    ...totals(d),
    children: d.kids
      .map((k) => ({ name: k.name, path: path + sep + k.name, ...totals(k) }))
      .sort((a, b) => b.bytes - a.bytes),
    exts: [...exts.entries()].map(([e, [c, b]]) => [e, c, b] as [string, number, number]).sort((a, b) => b[2] - a[2]),
    largest: files
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 50)
      .map((f) => ({ ...f, modifiedAt: scannedAt - 86_400_000 })),
  };
}

const listeners = new Set<(p: UsageProgress) => void>();

export const sampleUsageApi = {
  async listUsage(): Promise<UsageSummary[]> {
    const t = totals(TREE);
    return [{ root: ROOT, scannedAt, bytes: t.bytes, files: t.files }];
  },
  async getUsageNode(root: string, path: string): Promise<UsageNode | null> {
    return root === ROOT ? view(path) : null;
  },
  async analyzeUsage(root: string): Promise<UsageAnalyzeResult> {
    if (root !== ROOT) return { error: 'not-found' };
    const t = totals(TREE);
    for (let i = 1; i <= 4; i++) {
      await new Promise((r) => setTimeout(r, 150));
      listeners.forEach((cb) =>
        cb({ root, files: Math.round((t.files * i) / 4), bytes: (t.bytes * i) / 4, dirs: t.dirs, current: root }),
      );
    }
    scannedAt = Date.now();
    return { ok: true, root, scannedAt };
  },
  async cancelUsage() {},
  async usageStatus(): Promise<UsageProgress | null> {
    return null;
  },
  onUsageProgress(cb: (p: UsageProgress) => void) {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
};
