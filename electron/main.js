
/*
 * @Author: your name
 * @Date: 2021-09-17 11:17:12
 * @LastEditTime: 2021-09-28 15:24:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\main.js
 */
const {app, ipcMain, webContents, BrowserWindow, Menu, BrowserView, dialog} = require('electron')
const fs = require('fs')
const MyTray = require('./tray')
const path = require('path')
let mainWin = null
let tray = null
let view = null
let webcontentId = 1
// 右键菜单
const contentMenu = Menu.buildFromTemplate([
    {role: 'copy',label: '复制'},
    {role: 'cut',label: '剪切'},
    {role: 'paste',label: '粘贴'},
    {role: 'reload', label: '刷新'},
    {label: '打开调试器',click() {
        webContents.fromId(webcontentId).toggleDevTools()
    }},

])
// 单例模式
// const getTheLock = app.requestSingleInstanceLock()
// if(!getTheLock){
//   app.quit()
// }else{
//   app.on('second-instance',(event,commandLine,workingDirectory)=>{
//     if(mainWin){
//       if(mainWin.isMinimized()) mainWin.restore()
//       mainWin.show()
//       mainWin.focus()
//     }
//   })
// }
function createWindow() {
    mainWin = new BrowserWindow({
        width: 1280,
        height: 720,
        show: false,
        transparent:false, //窗口透明化，用于自定义窗口样式等，但目前与很多功能冲突，比如导致frame max无效等
        frame: false,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        },
        
    })
    
    if(process.env.NODE_ENV === 'dev') {
       mainWin.loadURL('http://localhost:8080') //项目启动地址
    } else {
        mainWin.loadFile(path.join(__dirname, '../index.html'))
    }
    mainWin.once('ready-to-show', () => {
        mainWin.show()
    })
    
    ipcMain.on('popupMenu', (e) => {
        webcontentId = e.sender.id
        contentMenu.popup(BrowserWindow.fromWebContents(e.sender))
    })

    setWindowOpenHandler(mainWin.webContents)
    watchSize()
    createView()
} 
function createView(){
    let [width, height] = mainWin.getSize()
    view = new BrowserView({
        width: width,
        height: height-40,
        webPreferences:{
            nodeIntegration: false,
            sandbox: true,
            nativeWindowOpen: false,
            preload: path.join(__dirname, 'preload.js')
        },
    })
    
    mainWin.setBrowserView(view)
    view.setBounds({ x: 0, y: 40, width, height })
    view.setAutoResize({
        width:true,
        height:true,
    })
    view.webContents.loadURL('https://xxxx.com/') 
    view.webContents.on('did-finish-load', function() {
        const css = fs.readFileSync(path.join(__dirname, './insert/index.css')).toString();
        view.webContents.insertCSS(css)
        
    })
    setWindowOpenHandler(view.webContents)
}
// 设置新增窗口
function setWindowOpenHandler(webContents) {
    webContents.setWindowOpenHandler((url,frameName,options)=> {
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                width: 1280,
                height: 720,
                autoHideMenuBar:true,
                webPreferences:{
                    nodeIntegration: false,
                    sandbox: true,
                    preload: path.join(__dirname, 'preload.js')
                },
            }
               
        }
    })
}
// 监听窗口变化
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
            mainWin.hide()
        }
    })
}
// app 的ready事件触发，创建窗口
app.whenReady().then(() => {
    createWindow()
    tray = new MyTray(mainWin)
    // initMenu()
    app.on('window-all-closed', () => {
        tray.destroy()
        app.quit()
    })
})
// 通过浏览器打开调试页面时的端口号
app.commandLine.appendSwitch('remote-debugging-port', '8100');