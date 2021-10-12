<!--
 * @Author: your name
 * @Date: 2021-09-18 11:16:14
 * @LastEditTime: 2021-10-12 15:50:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\src\components\HeadBar.vue
-->
<template>
  <div  class="head-bar drag">
      <img src='../assets/logo.png'/>
        打包目录：
        <el-breadcrumb separator='/' class="no-drag">
            <el-breadcrumb-item  v-for="(item, index) in dirPathArray" :key="item" @click="jumpTo(index)">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <span class="no-drag" >
          <i @click='setWinStatus("minimize")' class="icon-header icon-minimize"></i>
          <i @click='setWinStatus(isMax?"unmaximize":"maximize")' :class="['icon-header',isMax ? 'icon-restore' : 'icon-maximize']"></i>
          <i @click='setWinStatus("close")' class="icon-header icon-close"></i>
        </span>
  </div>
</template>

<script>
import {ref, onMounted, onUnmounted, computed} from 'vue'
import {ElBreadcrumb, ElBreadcrumbItem} from 'element-plus'
import {inject} from 'vue'
/*
 * 直接使用require会报错，因为vue在构建项目时不会区分这是node语句而忽略，所以会报错
 * 使用window.requeire来防止构建时处理
 * ipcRenderer是electron中专门给渲染进程使用的模块，主要功能是实现主进程与渲染进程通信
 * 
 */
const {ipcRenderer} = window.require('electron')
export default {
    components:{ElBreadcrumbItem,ElBreadcrumb},
    setup() {
        const isMax = ref(false)
        const dirPath = inject('dirPath')
        const dirPathArray = computed(()=>{
            return dirPath.value.split('\\')
        }) 
        const jumpTo = (index)=> {
            dirPath.value = dirPathArray.value.slice(0,index+1).join('\\') +'\\'
        }
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
            isMax, setWinStatus,dirPathArray,jumpTo
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
    > span {
        margin: 0 10px 0 auto;
        i {
            margin: 0 5px;
        }
    }
    /deep/ .el-breadcrumb__inner {
        cursor: pointer;
        &:hover {
            color: #409eff;
        }
    }
    /deep/ .el-breadcrumb__separator {
        margin:0 3px
    }
}
</style>