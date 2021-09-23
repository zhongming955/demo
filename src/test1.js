/*
 * @Author: your name
 * @Date: 2021-09-22 17:34:02
 * @LastEditTime: 2021-09-23 08:49:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\src\test1.js
 */
console.log('window.load',window.onload)
window.onload = () => {
    console.log("onload",'test1')
}
setTimeout(()=>console.log('setTimeout'),100)