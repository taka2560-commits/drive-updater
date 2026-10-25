import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('localUpdater', {
  openPath: (p: string) => ipcRenderer.invoke('open-path', p),
  showInFolder: (p: string) => ipcRenderer.invoke('show-in-folder', p),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  getDefaultPaths: () => ipcRenderer.invoke('get-default-paths'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanFolders: (
    folders: { key: string; path: string }[],
    recursive: boolean,
    excludeKeywords: string[],
  ) => ipcRenderer.invoke('scan-folders', folders, recursive, excludeKeywords),
  readImage: (path: string) => ipcRenderer.invoke('read-image', path),
  readText: (path: string) => ipcRenderer.invoke('read-text', path),
  statPaths: (paths: string[]) => ipcRenderer.invoke('stat-paths', paths),
  trashItem: (path: string) => ipcRenderer.invoke('trash-item', path),
  renameItem: (oldPath: string, newName: string) =>
    ipcRenderer.invoke('rename-item', oldPath, newName),
  startWatch: (paths: string[], recursive: boolean) =>
    ipcRenderer.send('start-watch', paths, recursive),
  // The IPC event (and its sender) stays in the preload; the page only gets a plain call.
  onFilesChanged: (cb: () => void) => {
    const listener = () => cb();
    ipcRenderer.on('files-changed', listener);
    return () => ipcRenderer.off('files-changed', listener);
  },
});
