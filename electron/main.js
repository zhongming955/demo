/*
 * @Author: your name
 * @Date: 2021-09-17 11:17:12
 * @LastEditTime: 2021-09-23 11:38:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\electron\main.js
 */
/*
 * @Author: your name
 * @Date: 2021-09-17 11:17:12
 * @LastEditTime: 2021-09-22 16:35:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\main.js
 */
const {app, ipcMain, BrowserWindow, Tray} = require('electron')
const path = require('path')
let mainWin = null
function createWindow() {
    mainWin = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        transparent:false, //窗口透明化，用于自定义窗口样式等，但目前与很多功能冲突，比如导致frame max无效等
        frame: false,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true
        }
    })
    if(process.env.NODE_ENV === 'dev') {
        mainWin.loadURL('http://localhost:8080') //项目启动地址
        mainWin.webContents.openDevTools()
    } else {
        mainWin.loadFile(path.join(__dirname, '../index.html'))
    }
    mainWin.once('ready-to-show', () => {
        mainWin.show()
    })
    watchSize()

} 
function watchSize() {
    // 通知渲染进程，窗口是否是最大化
    const sendIsMaximize = () => {
        mainWin.webContents.send('isMaximize', mainWin.isMaximized())
    }
    // 监听最大化，取消最大化，还原事件
    mainWin.on('maximize', sendIsMaximize)
    mainWin.on('unmaximize', sendIsMaximize)
    mainWin.on('restore', sendIsMaximize)
    // 接收渲染进程通过ipcRenderer传的信息，对窗口进行相关操作
    ipcMain.on('setWinStatus', (event, payload) => {
        if(payload === 'maximize') {
           mainWin.maximize()
        }else if(payload === 'minimize') {
            mainWin.minimize()
        }else if(payload === 'unmaximize') {
            mainWin.unmaximize()
        }else if(payload === 'close') {
            mainWin.close()
        }
    })
}
// app 的ready事件触发，创建窗口
app.whenReady().then(() => {
    createWindow()
    app.on('window-all-closed', () => {
        app.quit()
    })
})
// 通过浏览器打开调试页面时的端口号
app.commandLine.appendSwitch('remote-debugging-port', '8100');