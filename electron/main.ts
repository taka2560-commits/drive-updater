import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import chokidar from 'chokidar';

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

// ディレクトリを走査してファイル + サブフォルダを返す
function scanDir(
  dir: string,
  folderKey: string,
  recursive: boolean,
  excludeKeywords: string[],
): FileEntry[] {
  const results: FileEntry[] = [];
  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (entry.startsWith('.')) continue;
    if (excludeKeywords.some((kw) => entry.toLowerCase().includes(kw.toLowerCase()))) continue;

    const fullPath = path.join(dir, entry);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(fullPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      results.push({
        path: fullPath,
        name: entry,
        ext: '',
        folder: folderKey,
        sizeBytes: 0,
        modifiedAt: stat.mtime.getTime(),
        accessedAt: stat.atime.getTime(),
        createdAt: stat.birthtime.getTime(),
        isDir: true,
      });
      if (recursive) {
        results.push(...scanDir(fullPath, folderKey, recursive, excludeKeywords));
      }
    } else {
      const ext = extname(entry).slice(1).toLowerCase();
      results.push({
        path: fullPath,
        name: entry,
        ext,
        folder: folderKey,
        sizeBytes: stat.size,
        modifiedAt: stat.mtime.getTime(),
        accessedAt: stat.atime.getTime(),
        createdAt: stat.birthtime.getTime(),
        isDir: false,
      });
    }
  }
  return results;
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
    const results: FileEntry[] = [];
    for (const folder of folders) {
      results.push(...scanDir(folder.path, folder.key, recursive, excludeKeywords));
    }
    return results;
  },
);

// 画像プレビュー: Base64 データURLを返す
ipcMain.handle('read-image', async (_e, filePath: string) => {
  try {
    const data = fs.readFileSync(filePath);
    const ext = extname(filePath).slice(1).toLowerCase();
    const mime = ext === 'jpg' ? 'jpeg' : ext === 'svg' ? 'svg+xml' : ext;
    return `data:image/${mime};base64,${data.toString('base64')}`;
  } catch {
    return null;
  }
});

// ファイル監視 (Chokidar) — 複数フォルダを監視し、変更をデバウンスして通知
let watcher: chokidar.FSWatcher | null = null;
let notifyTimer: NodeJS.Timeout | null = null;

ipcMain.on('start-watch', (_e, paths: string[], recursive = false) => {
  const valid = (paths ?? []).filter((p) => p && fs.existsSync(p));
  if (valid.length === 0) return;

  if (watcher) watcher.close();
  watcher = chokidar.watch(valid, {
    ignored: /(^|[/\\])\../, // dotfiles
    persistent: true,
    ignoreInitial: true,
    depth: recursive ? undefined : 0,
  });

  watcher.on('all', (_eventName, filePath) => {
    if (basename(filePath).startsWith('.')) return;
    // Debounce: filesystem bursts collapse into one renderer refresh.
    if (notifyTimer) clearTimeout(notifyTimer);
    notifyTimer = setTimeout(() => {
      if (win) win.webContents.send('files-changed');
    }, 300);
  });
});
