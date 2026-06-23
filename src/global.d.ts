// Type declaration for the Electron preload bridge.
// window.localUpdater is undefined in browser-only (dev) mode.
interface LocalUpdaterAPI {
  openPath: (p: string) => Promise<void>;
  showInFolder: (p: string) => Promise<void>;
  getDefaultPaths: () => Promise<{ desktop: string; documents: string; downloads: string }>;
  selectFolder: () => Promise<{ name: string; path: string } | null>;
  scanFolders: (
    folders: { key: string; path: string }[],
    recursive: boolean,
    excludeKeywords: string[],
  ) => Promise<import('./types').FileEntry[]>;
  readImage: (path: string) => Promise<string | null>;
  startWatch: (paths: string[], recursive: boolean) => void;
  onFilesChanged: (cb: () => void) => () => void;
}

interface Window {
  localUpdater?: LocalUpdaterAPI;
}
