/*
 * @Author: your name
 * @Date: 2021-09-27 14:57:53
 * @LastEditTime: 2021-09-28 11:49:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\electron\perload.js
 */
const ipc = require('electron').ipcRenderer
console.log('ipc',ipc)
ipc.on('console',(e,payload) => {
    console.log('mainConsole',payload)
})
window.addEventListener('contextmenu', (e) => {
    ipc.send('popupMenu',)
})
// document.addEventListener('DOMContentLoaded',(e)=> {
//     console.log(document.getElementById('app').classList)
//     document.getElementById('app').classList.add('drag')
//     console.log(document.getElementById('app').classList)
// })
// window.onload=(e=>{
//     console.log(document.body)
    
// })