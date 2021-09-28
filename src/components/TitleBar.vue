<!--
 * @Author: your name
 * @Date: 2021-09-18 11:16:14
 * @LastEditTime: 2021-09-28 11:41:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\src\components\HeadBar.vue
-->
<template>
  <div :ref="el => refDiv = el"  class="head-bar drag">
      <img src='../assets/logo.png'/>
        青鸾客户端
        <span class="no-drag">
          <i @click='setWinStatus("minimize")' class="icon-header icon-minimize"></i>
          <i @click='setWinStatus(isMax?"unmaximize":"maximize")' :class="['icon-header',isMax ? 'icon-restore' : 'icon-maximize']"></i>
          <i @click='setWinStatus("close")' class="icon-header icon-close"></i>
        </span>
  </div>
</template>

<script>
import {ref, onMounted, onUnmounted } from 'vue'
/*
 * 直接使用require会报错，因为vue在构建项目时不会区分这是node语句而忽略，所以会报错
 * 使用window.requeire来防止构建时处理
 * ipcRenderer是electron中专门给渲染进程使用的模块，主要功能是实现主进程与渲染进程通信
 * 
 */
const {ipcRenderer} = window.require('electron')
export default {
    setup() {
        const isMax = ref(false)
        const refDiv = ref(null)
        onMounted(() => {
            console.log('mounted')
            // 监听主进程发的消息，
            ipcRenderer.on('isMaximize',(e,payload) => {
                isMax.value = payload
            })
        })
        onUnmounted(() => {
            ipcRenderer.removeListener('isMaximize')
        })
        const setWinStatus = (msg) => {
            // 给主进程发消息，通知主进程操作窗口
            ipcRenderer.send('setWinStatus', msg)
        }
        return {
            isMax, setWinStatus,refDiv
        }
    }
}
</script>

<style lang="scss" scoped>
.head-bar {
    height: 40px;
    display: flex;
    align-items: center;
    background-color: #EEE;
    img {
        width: 35px;
        margin: 5px;
    }
    span {
        margin: 0 10px 0 auto;
        i {
            margin: 0 5px;
        }
    }
}
</style>