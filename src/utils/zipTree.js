/*
 * @Author: your name
 * @Date: 2021-10-11 15:21:19
 * @LastEditTime: 2021-10-12 15:45:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\src\utils\zipTree.js
 */
const fs = window.require('fs')
const archiver = window.require('archiver')
export default function zipTree(fileData=[],createPath){
    return new Promise(function(resolve, reject){
        let dir = ''
        fileData = fileData.flatMap((item) => {
            if(dir && item.path.includes(dir)) return []
            if(!item.isFile){
                dir = item.path
                return [item]
            }
            return [item]
        })
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
        let output = fs.createWriteStream(createPath+'/'+filePaths_char[0][n-2]+ '.zip')
        let  archive = archiver('zip',{
            zlib: {level:9}
        })
        output.on('close', function(){
            resolve()
        })
        archive.on('error',function(err){
            console.log('error',err)
            reject(err)
        })
        //zip
        archive.pipe(output)
        fileData.forEach((data,index) => {
            let subPath = filePaths_char[index].slice(n-2).join('/')
            if(data.isFile){
                archive.file(fileData[index].path,{
                    name:subPath
                })
            }else {
                archive.directory(fileData[index].path,subPath)
            }
        })
        archive.finalize()
    })

}