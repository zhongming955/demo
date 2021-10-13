/*
 * @Author: your name
 * @Date: 2021-10-12 16:51:37
 * @LastEditTime: 2021-10-13 14:59:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\electron\utils\zip.js
 */

const fs = require('fs')
const archiver = require('archiver')
module.exports = function zipTree(files){
    return new Promise(function(resolve, reject){
        let filePaths_char =files.map(item=> {
            return item.split('\\')
        })
        console.log(2222,files)
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
        let dir = filePaths_char[0].slice(0,n-1).join('/')
        let output = fs.createWriteStream(dir+'/'+(files.length === 1?filePaths_char[0][n-1]:filePaths_char[0][n-2])+ '.zip')
        let  archive = archiver('zip',{
            zlib: {level:9}
        })
        output.on('close', function(){
            resolve(dir)
        })
        archive.on('error',function(err){
            console.log('error',err)
            reject(err)
        })
        //zip
        archive.pipe(output)
        files.forEach((path,index) => {
            let subPath = filePaths_char[index].slice(n-1).join('/')
            if(fs.statSync(path).isFile()){
                archive.file(path,{
                    name:subPath
                })
            }else {
                archive.directory(path,subPath)
            }
        })
        archive.finalize()
    })

}