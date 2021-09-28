
/*
 * @Author: your name
 * @Date: 2021-09-23 14:26:08
 * @LastEditTime: 2021-09-28 14:26:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\electron\tray.js
 */
const {Tray, Menu} = require('electron')
const {name, version} = require('../package.json')
const path = require('path')
module.exports = class MyTray{
    constructor(win) {
        this.win = win
        return this.init()
    }
    init(){
        const tray = new Tray(path.join(__dirname,'tray_window.png'))
        //tray.setImage()
        const contextMenu = Menu.buildFromTemplate([
            {label: `退出${name}`,type:'normal', role: 'quit'},
        ])
        tray.setContextMenu(contextMenu)
        tray.setToolTip(name)
        tray.on('click',() => {
            this.win.show()
            this.win.focus()
        })
        return tray
    }
}