// Type declaration for the Electron preload bridge.
// window.localUpdater is undefined in browser-only (dev) mode.
interface LocalUpdaterAPI {
  openPath: (p: string) => Promise<void>;
  showInFolder: (p: string) => Promise<void>;
  openExternal: (url: string) => Promise<void>;
  getDefaultPaths: () => Promise<{ desktop: string; documents: string; downloads: string }>;
  selectFolder: () => Promise<{ name: string; path: string } | null>;
  scanFolders: (
    folders: { key: string; path: string }[],
    recursive: boolean,
    excludeKeywords: string[],
  ) => Promise<import('./types').FileEntry[]>;
  readImage: (path: string) => Promise<string | null>;
  readText: (path: string) => Promise<string | null>;
  statPaths: (paths: string[]) => Promise<import('./types').FileEntry[]>;
  trashItem: (path: string) => Promise<boolean>;
  renameItem: (oldPath: string, newName: string) => Promise<string | null>;
  startWatch: (paths: string[], recursive: boolean) => void;
  analyzeUsage: (root: string) => Promise<import('./types').UsageAnalyzeResult>;
  cancelUsage: () => Promise<void>;
  usageStatus: () => Promise<import('./types').UsageProgress | null>;
  getUsageNode: (root: string, path: string) => Promise<import('./types').UsageNode | null>;
  listUsage: () => Promise<import('./types').UsageSummary[]>;
  onUsageProgress: (cb: (p: import('./types').UsageProgress) => void) => () => void;
  onFilesChanged: (cb: () => void) => () => void;
}

interface Window {
  localUpdater?: LocalUpdaterAPI;
}

// Injected by vite.config.ts from package.json ("version").
declare const __APP_VERSION__: string;
