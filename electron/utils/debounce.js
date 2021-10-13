/*
 * @Author: your name
 * @Date: 2021-10-13 10:52:50
 * @LastEditTime: 2021-10-13 15:08:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\electron\utils\debounce.js
 */
module.exports = function debounce(func,wait){
    let timer = null
    return (arg)=>{
        if(timer){
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(()=>{
            func.call(this,arg)
            clearTimeout(timer)
            timer = null
        },wait)
    }
}