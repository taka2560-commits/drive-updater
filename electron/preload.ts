import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getDefaultPaths: () => ipcRenderer.invoke('get-default-paths'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanDirectory: (dir: string, recursive: boolean, excludeTerms: string[]) => ipcRenderer.invoke('scan-directory', dir, recursive, excludeTerms),
  readImage: (filePath: string) => ipcRenderer.invoke('read-image', filePath),
  openFile: (filePath: string) => ipcRenderer.invoke('open-file', filePath),
  openFolder: (filePath: string) => ipcRenderer.invoke('open-folder', filePath),
  startWatch: (dir: string) => ipcRenderer.send('start-watch', dir),
  onFileChanged: (callback: (event: any, data: any) => void) => {
    ipcRenderer.on('file-changed', callback)
    return () => ipcRenderer.removeAllListeners('file-changed')
  }
})
