
/*
 * @Author: your name
 * @Date: 2021-09-17 11:17:12
 * @LastEditTime: 2021-10-13 16:15:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\main.js
 */
const { app, ipcMain, webContents, BrowserWindow, Menu, dialog } = require('electron')
const { exec } = require('child_process')
const path = require('path')
const zip = require('./utils/zip')
const debounce = require('./utils/debounce')
let winMap = new Map()
let webcontentId = 1

// 创建新窗口并返回Win
function createWindow() {
    let newWin = new BrowserWindow({
        width: 800,
        height: 720,
        show: false,
        transparent: false, //窗口透明化，用于自定义窗口样式等，但目前与很多功能冲突，比如导致frame max无效等
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        },

    })
    if (process.env.NODE_ENV === 'dev') {
        newWin.loadURL('http://localhost:8080') //项目启动地址
    } else {
        newWin.loadFile(path.join(__dirname, '../index.html'))
    }
    newWin.once('ready-to-show', () => {
        newWin.show()
    })

    watchSize(newWin)
    return newWin
}
// 监听窗口变化
function watchSize(win) {
    // 通知渲染进程，窗口是否是最大化
    const sendIsMaximize = () => {
        win.webContents.send('isMaximize', win.isMaximized())
    }
    // 监听最大化，取消最大化，还原事件
    win.on('maximize', sendIsMaximize)
    win.on('unmaximize', sendIsMaximize)
    win.on('restore', sendIsMaximize)
}
// 给ipcMain加各种监听
function addMainListen() {
    // 渲染进程获取目录路径
    ipcMain.on('getZipInfo', (event) => {

        let winId = BrowserWindow.fromWebContents(event.sender).id
        let dirPath = ''
        winMap.forEach((value, key) => {
            if (value.id === winId) dirPath = key
        })

        event.returnValue = JSON.stringify({
            path: dirPath
        })
    })
    
    // 接收渲染进程通过ipcRenderer传的信息，对窗口进行相关操作
    ipcMain.on('setWinStatus', (event, payload) => {
        let currentWin = BrowserWindow.fromWebContents(event.sender)
        if (payload === 'maximize') {
            currentWin.maximize()
        } else if (payload === 'minimize') {
            currentWin.minimize()
        } else if (payload === 'unmaximize') {
            currentWin.unmaximize()
        } else if (payload === 'close') {
            currentWin.close()
        }
    })
    // 右键菜单
    const contentMenu = Menu.buildFromTemplate([
        { role: 'copy', label: '复制' },
        { role: 'cut', label: '剪切' },
        { role: 'paste', label: '粘贴' },
        { role: 'reload', label: '刷新' },
        {
            label: '打开调试器', click() {
                webContents.fromId(webcontentId).toggleDevTools()
            }
        },

    ])

    ipcMain.on('popupMenu', (e) => {
        webcontentId = e.sender.id
        contentMenu.popup(BrowserWindow.fromWebContents(e.sender))
    })

    ipcMain.on('closeApp', (e) => {
        BrowserWindow.fromWebContents(e.sender).close()
    })

    ipcMain.on('openDir', (event, path) => {
        exec(`explorer ${path}`)
    })
}
// 压缩业务相关代码 
function getHandleArgv() {
    let zipFile = []
    const zipFunc = debounce(() => {
        console.log(new Date())
        zip([...zipFile]).then(res=>{
            dialog.showMessageBox({
                message:`打包成功,文件地址:${res}`,
                type:'info',
                title: '提示',
            })
            .then(()=> {
                exec(`explorer ${path.normalize(res) }`)

                if(!winMap.size) app.quit()
            })
        }).catch(err=>{
            dialog.showMessageBox({
                message:'打包失败',
                type:'error',
                title: '提示',
            })
        })
        zipFile = []
    }, 3000)
    return (argv1) => {
        let argv = [...argv1]
        if ((argv.length > 2 && argv[argv.length-2] === 'zip')) {
            // 直接压缩
            zipFile.push(argv.pop())
            zipFunc()
        } else {
            let dirPath = path.resolve(argv.length > 2 ? path.resolve(argv.pop()) : '.')
            if (winMap.has(dirPath)) {
                let win = winMap.get(dirPath)
                if (win) {
                    if (win.isMinimized()) win.restore()
                    win.show()
                    win.focus()
                }
            } else {
                const newWin = createWindow()
                winMap.set(dirPath, newWin)
            }
        }
    }
}
const handleArgv = getHandleArgv()

// 单例模式
const getTheLock = app.requestSingleInstanceLock()
if (!getTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        handleArgv(commandLine)
    })
    // app 的ready事件触发，创建窗口
    app.whenReady().then(() => {
        handleArgv(process.argv)
        addMainListen()
        app.on('window-all-closed', () => {
            //tray.destroy()
            app.quit()
        })
    })
}

// 通过浏览器打开调试页面时的端口号
app.commandLine.appendSwitch('remote-debugging-port', '8100');