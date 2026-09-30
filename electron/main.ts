import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { watch, type FSWatcher } from 'chokidar';

const __dirname = dirname(fileURLToPath(import.meta.url));

let win: BrowserWindow | null = null;

function createWindow() {
  // Dev: build/ is two levels up from dist-electron/. Prod: packaged resources.
  const devIcon = join(__dirname, '../build/icon.png');
  win = new BrowserWindow({
    width: 1200,
    height: 760,
    minWidth: 1024,
    minHeight: 640,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#222629',
    icon: fs.existsSync(devIcon) ? devIcon : undefined,
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
  win = null;
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// デフォルトのディレクトリパスを返す
ipcMain.handle('get-default-paths', () => ({
  desktop: app.getPath('desktop'),
  documents: app.getPath('documents'),
  downloads: app.getPath('downloads'),
}));

// フォルダ選択ダイアログ
ipcMain.handle('select-folder', async () => {
  if (!win) return null;
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
  });
  if (canceled) return null;
  return { name: path.basename(filePaths[0]), path: filePaths[0] };
});

// OSネイティブアクション
ipcMain.handle('open-path', (_e, p: string) => shell.openPath(p));
ipcMain.handle('show-in-folder', (_e, p: string) => shell.showItemInFolder(p));

// ファイル/フォルダをゴミ箱へ移動（復元可能）
ipcMain.handle('trash-item', async (_e, p: string) => {
  try {
    await shell.trashItem(p);
    return true;
  } catch {
    return false;
  }
});

// 外部リンク（GitHub のみ許可）
ipcMain.handle('open-external', (_e, url: string) => {
  if (typeof url === 'string' && /^https:\/\/github\.com\//.test(url)) return shell.openExternal(url);
});

// Windows で使えないファイル名（renderer 側 lib/fileName.ts と同じ規則）
const INVALID_NAME_CHARS = /[\\/:*?"<>|]/;
const hasControlChar = (s: string) => [...s].some((c) => c.charCodeAt(0) < 32);
const RESERVED_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
const CASE_INSENSITIVE_FS = process.platform === 'win32' || process.platform === 'darwin';

// ファイル/フォルダ名を変更し、新しいパスを返す（失敗時 null）
ipcMain.handle('rename-item', (_e, oldPath: string, newName: string) => {
  try {
    if (
      typeof newName !== 'string' ||
      !newName ||
      newName === '.' ||
      newName === '..' ||
      INVALID_NAME_CHARS.test(newName) ||
      hasControlChar(newName) ||
      /[. ]$/.test(newName) ||
      RESERVED_NAMES.test(newName)
    ) {
      return null; // 別フォルダへの移動や不正な名前は許可しない
    }
    const next = path.join(path.dirname(oldPath), newName);
    // 大文字小文字だけの変更は「同じファイル」なので存在チェックを飛ばす
    const sameFile = CASE_INSENSITIVE_FS && next.toLowerCase() === oldPath.toLowerCase();
    if (!sameFile && fs.existsSync(next)) return null; // 同名が既に存在
    fs.renameSync(oldPath, next);
    return next;
  } catch {
    return null;
  }
});

// テキストファイルの内容を返す（256KB上限・失敗時 null）。UTF-8 で読めなければ Shift_JIS として解釈
ipcMain.handle('read-text', (_e, filePath: string) => {
  try {
    const stat = fs.statSync(filePath);
    if (stat.size > 256 * 1024) return null;
    const buf = fs.readFileSync(filePath);
    if (buf.subarray(0, 4096).includes(0)) return null; // バイナリ
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(buf);
    } catch {
      try {
        return new TextDecoder('shift_jis').decode(buf);
      } catch {
        return buf.toString('utf8');
      }
    }
  } catch {
    return null;
  }
});

// FileEntry 型（renderer 側の types.ts と一致させる）
interface FileEntry {
  path: string;
  name: string;
  ext: string;
  folder: string;
  sizeBytes: number;
  modifiedAt: number;
  accessedAt: number;
  createdAt: number;
  isDir: boolean;
}

// 同時に発行するファイル操作の上限（大きなフォルダでもメインプロセスを止めず、ハンドルも使い切らない）
function createLimiter(max: number) {
  let active = 0;
  const waiting: (() => void)[] = [];
  return async function run<T>(fn: () => Promise<T>): Promise<T> {
    if (active >= max) await new Promise<void>((resolve) => waiting.push(resolve));
    else active++;
    try {
      return await fn();
    } finally {
      const next = waiting.shift();
      if (next) next(); // 枠を待機中の処理へ引き渡す
      else active--;
    }
  };
}
type Limiter = ReturnType<typeof createLimiter>;

// ディレクトリを走査してファイル + サブフォルダを返す（非同期。UI をブロックしない）
async function scanDir(
  dir: string,
  folderKey: string,
  recursive: boolean,
  excludeSet: Set<string>,
  limit: Limiter,
): Promise<FileEntry[]> {
  let entries: fs.Dirent[];
  try {
    entries = await limit(() => fs.promises.readdir(dir, { withFileTypes: true }));
  } catch {
    return [];
  }

  const perEntry = await Promise.all(
    entries.map(async (dirent): Promise<FileEntry[]> => {
      const entry = dirent.name;
      // Office のロックファイル (~$...) とドットファイルは対象外
      if (entry.startsWith('.') || entry.startsWith('~$')) return [];
      // Exclude on whole-name match (case-insensitive), not substring: a keyword
      // like "dist" hides a folder/file *named* dist, never "distribution.pdf".
      if (excludeSet.has(entry.toLowerCase())) return [];

      const fullPath = path.join(dir, entry);
      let stat: fs.Stats;
      try {
        stat = await limit(() => fs.promises.stat(fullPath));
      } catch {
        return [];
      }

      if (stat.isDirectory()) {
        const self: FileEntry = {
          path: fullPath,
          name: entry,
          ext: '',
          folder: folderKey,
          sizeBytes: 0,
          modifiedAt: stat.mtime.getTime(),
          accessedAt: stat.atime.getTime(),
          createdAt: stat.birthtime.getTime(),
          isDir: true,
        };
        // シンボリックリンク/ジャンクションは辿らない（循環参照の防止）
        if (!recursive || dirent.isSymbolicLink()) return [self];
        const children = await scanDir(fullPath, folderKey, recursive, excludeSet, limit);
        return [self, ...children];
      }
      return [
        {
          path: fullPath,
          name: entry,
          ext: extname(entry).slice(1).toLowerCase(),
          folder: folderKey,
          sizeBytes: stat.size,
          modifiedAt: stat.mtime.getTime(),
          accessedAt: stat.atime.getTime(),
          createdAt: stat.birthtime.getTime(),
          isDir: false,
        },
      ];
    }),
  );
  return perEntry.flat();
}

// 複数フォルダをスキャンして FileEntry[] を返す
ipcMain.handle(
  'scan-folders',
  async (
    _e,
    folders: { key: string; path: string }[],
    recursive = false,
    excludeKeywords: string[] = [],
  ) => {
    const excludeSet = new Set(excludeKeywords.map((k) => k.toLowerCase()));
    const limit = createLimiter(64);
    const perFolder = await Promise.all(
      folders.map((folder) => scanDir(folder.path, folder.key, recursive, excludeSet, limit)),
    );
    return perFolder.flat();
  },
);

// 画像プレビュー: Base64 データURLを返す（25MB 超は読み込まない）
ipcMain.handle('read-image', async (_e, filePath: string) => {
  try {
    if (fs.statSync(filePath).size > 25 * 1024 * 1024) return null;
    const data = fs.readFileSync(filePath);
    const ext = extname(filePath).slice(1).toLowerCase();
    const mime = ext === 'jpg' ? 'jpeg' : ext === 'svg' ? 'svg+xml' : ext;
    return `data:image/${mime};base64,${data.toString('base64')}`;
  } catch {
    return null;
  }
});

// ファイル監視 (Chokidar) — 複数フォルダを監視し、変更をデバウンスして通知
let watcher: FSWatcher | null = null;
let notifyTimer: NodeJS.Timeout | null = null;

// 監視は常に直下1階層のみ。サブフォルダ込みの一覧では、数万ファイルを chokidar で再帰監視すると
// 初回走査だけでファイル処理の待ち行列を占有し、スキャン結果が数十秒返らなくなるため、
// 深い階層の変更は renderer 側のウィンドウ復帰時/定期の再スキャンで拾う。
ipcMain.on('start-watch', (_e, paths: string[]) => {
  const valid = [...new Set((paths ?? []).filter((p) => p && fs.existsSync(p)))];
  if (valid.length === 0) return;

  if (watcher) void watcher.close();
  watcher = watch(valid, {
    // dotfiles と node_modules は無視
    ignored: /(^|[/\\])(\.|node_modules([/\\]|$))/,
    persistent: true,
    ignoreInitial: true,
    depth: 0,
  });

  watcher.on('all', (_eventName: string, filePath: string) => {
    if (basename(filePath).startsWith('.') || basename(filePath).startsWith('~$')) return;
    // Debounce: filesystem bursts collapse into one renderer refresh.
    if (notifyTimer) clearTimeout(notifyTimer);
    notifyTimer = setTimeout(() => {
      if (win) win.webContents.send('files-changed');
    }, 300);
  });
});
