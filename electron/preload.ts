import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('localUpdater', {
  openPath: (p: string) => ipcRenderer.invoke('open-path', p),
  showInFolder: (p: string) => ipcRenderer.invoke('show-in-folder', p),
  getDefaultPaths: () => ipcRenderer.invoke('get-default-paths'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanFolders: (
    folders: { key: string; path: string }[],
    recursive: boolean,
    excludeKeywords: string[],
  ) => ipcRenderer.invoke('scan-folders', folders, recursive, excludeKeywords),
  onFilesChanged: (cb: () => void) => {
    ipcRenderer.on('files-changed', cb);
    return () => ipcRenderer.off('files-changed', cb);
  },
});
