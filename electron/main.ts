import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import chokidar from 'chokidar'

const __dirname = dirname(fileURLToPath(import.meta.url))

let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.mjs'),
      // webSecurity: false, // プレビュー用のローカルファイルアクセスに必要だが、今回はIPC経由で安全に渡す
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// デフォルトのディレクトリパスを取得するAPI
ipcMain.handle('get-default-paths', () => {
  return {
    desktop: app.getPath('desktop'),
    documents: app.getPath('documents'),
    downloads: app.getPath('downloads'),
  }
})

// OSのフォルダ選択ダイアログを表示
ipcMain.handle('select-folder', async () => {
  if (!win) return null
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  })
  if (canceled) return null
  return {
    path: filePaths[0],
    name: path.basename(filePaths[0])
  }
})


function getFileType(ext: string) {
  ext = ext.toLowerCase()
  if (['.doc', '.docx', '.txt', '.md'].includes(ext)) return 'document'
  if (['.xls', '.xlsx', '.csv'].includes(ext)) return 'spreadsheet'
  if (['.ppt', '.pptx'].includes(ext)) return 'presentation'
  if (['.pdf'].includes(ext)) return 'pdf'
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) return 'image'
  return 'other'
}

function scanFiles(dir: string, recursive = false, excludeTerms: string[] = []): any[] {
  let results: any[] = []
  try {
    const list = fs.readdirSync(dir)
    for (const file of list) {
      // 隠しファイル除外設定を仮定
      if (file.startsWith('.')) continue
      // 除外設定
      if (excludeTerms.some(term => file.includes(term))) continue

      const filePath = path.join(dir, file)
      try {
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          if (recursive) {
            results = results.concat(scanFiles(filePath, recursive, excludeTerms))
          }
        } else {
          results.push({
            id: filePath,
            name: file,
            path: filePath,
            type: getFileType(path.extname(file)),
            size: stat.size,
            created: stat.birthtime,
            updated: stat.mtime,
            accessed: stat.atime
          })
        }
      } catch (err) {
        // アクセス権エラーなどはスキップ
      }
    }
  } catch (error) {
    console.error('Error scanning files:', error)
  }
  return results
}

ipcMain.handle('scan-directory', async (event, dir: string, recursive = false, excludeTerms = []) => {
  if (!dir) dir = app.getPath('desktop')
  return scanFiles(dir, recursive, excludeTerms)
})

// 画像読み込みAPI (プレビュー用) Base64で返す
ipcMain.handle('read-image', async (event, filePath: string) => {
  try {
    const data = fs.readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase().replace('.', '')
    const mime = ext === 'jpg' ? 'jpeg' : ext === 'svg' ? 'svg+xml' : ext
    return `data:image/${mime};base64,${data.toString('base64')}`
  } catch (err) {
    return null
  }
})

// OSネイティブアクション
ipcMain.handle('open-file', async (event, filePath: string) => {
  return shell.openPath(filePath)
})

ipcMain.handle('open-folder', async (event, filePath: string) => {
  shell.showItemInFolder(filePath)
})

// ファイル監視 (Chokidar)
let watcher: chokidar.FSWatcher | null = null
ipcMain.on('start-watch', (event, dir: string) => {
  if (!dir) return
  if (watcher) {
    watcher.close()
  }
  watcher = chokidar.watch(dir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    depth: 0 // とりあえず直下のみ。深いと重い
  })
  
  watcher.on('all', (eventName, filePath) => {
    if (win && !filePath.split(/[\\/]/).pop()?.startsWith('.')) {
      win.webContents.send('file-changed', { event: eventName, path: filePath })
    }
  })
})
