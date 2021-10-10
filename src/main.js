/*
 * @Author: your name
 * @Date: 2021-09-17 10:41:52
 * @LastEditTime: 2021-10-09 15:17:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\src\main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/icon.css'
import './assets/css/common.css'
import 'element-plus/dist/index.css'
console.log('jsload')

// let a = async function(){

//     let aa = async()=>{
//         await import('./test.js')
//         await import('./test1.js')
//         console.log('load end')

//     }
//     await aa()

// }
// a()

createApp(App).mount('#app')
