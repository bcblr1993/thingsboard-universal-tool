import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { join, dirname } from 'node:path'
import { release } from 'node:os'
import { fileURLToPath } from 'node:url'

const currentFilename = fileURLToPath(import.meta.url)
const projectRoot = dirname(currentFilename)

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(projectRoot, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST || '', 'index.html')

async function createWindow() {
    win = new BrowserWindow({
        title: 'ThingsBoard Universal Tool',
        icon: join(process.env.PUBLIC || '', 'favicon.ico'),
        width: 1200,
        height: 800,
        minWidth: 1024,
        minHeight: 768,
        frame: false, // Frameless for custom UI
        titleBarStyle: 'hidden',
        transparent: true, // Enable transparency for glass effects
        vibrancy: 'fullscreen-ui', // MacOS effect
        webPreferences: {
            preload,
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-plugin injects this
        win.loadURL(url as string)
        // win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })

    // Custom Window Controls
    ipcMain.on('window-min', () => win?.minimize())
    ipcMain.on('window-max', () => {
        if (win?.isMaximized()) {
            win.unmaximize()
        } else {
            win?.maximize()
        }
    })
    ipcMain.on('window-close', () => win?.close())
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})
