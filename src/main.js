/*
 * @Author: your name
 * @Date: 2021-09-17 10:41:52
 * @LastEditTime: 2021-10-11 16:11:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\src\main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/icon.css'
import './assets/css/common.css'
import {ElLoading} from 'element-plus'
import 'element-plus/dist/index.css'
createApp(App).use(ElLoading).mount('#app')
