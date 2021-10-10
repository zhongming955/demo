/*
 * @Author: your name
 * @Date: 2021-09-27 14:57:53
 * @LastEditTime: 2021-10-09 17:14:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\electron\perload.js
 */
const ipc = require('electron').ipcRenderer
const fs = require('fs')
const JSZip = require('jszip')
console.log('ipc',ipc)
ipc.on('console',(e,payload) => {
    console.log('mainConsole',payload)
})
window.addEventListener('contextmenu', (e) => {
    ipc.send('popupMenu',)
})
window.creatZip = (fileData=[])=> {
    let filePaths_char =fileData.map(item=> {
        return item.path.split('\\')
    })
    let n = 0
    let flag = true
    while(n<filePaths_char[0].length && flag){
        let char = filePaths_char[0][n]
        for(let i=0; i<filePaths_char.length; i++){
            if(filePaths_char[i][n] !== char){
                flag = false
                break;
            }
        }
        n++

    }
    let zip = new JSZip()
    fileData.forEach((data,index)=> {
        let subPath = filePaths_char[index].slice(n-2).join('/')
        data.isFile ? zip.file(subPath) : zip.folder(subPath)
    })
    zip.generateAsync({
        type: 'nodebuffer',
        platform: process.platform,
    }).then(function(content){
        let zipName = filePaths_char[0].slice(0,n-1).join('/')+'/'+filePaths_char[0][n-2]+ '.zip'
        fs.writeFile(zipName, content, function(err) {
            // if (!err) {
            //     // 是否删除源文件
            //     if (delSource) {
            //         extArr.forEach(ext => {
            //             delFile(fileName + ext);
            //         })
            //     }
            // } else {
                if(err)  console.log(zipName + '压缩失败');
            // }    
        })
    })
}
// document.addEventListener('DOMContentLoaded',(e)=> {
//     console.log(document.getElementById('app').classList)
//     document.getElementById('app').classList.add('drag')
//     console.log(document.getElementById('app').classList)
// })
// window.onload=(e=>{
//     console.log(document.body)
    
// })