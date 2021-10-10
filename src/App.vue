<!--
 * @Author: your name
 * @Date: 2021-09-17 10:41:52
 * @LastEditTime: 2021-10-09 15:58:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\src\App.vue
-->
<template>
  <TitleBar></TitleBar>
  <file-tree ></file-tree>

</template>

<script>
import TitleBar from './components/TitleBar.vue'
import FileTree from './components/FileTree.vue'
export default {
  name: 'App',
  components: {
    TitleBar,
    FileTree,
  },
  mounted(){
  },
  setup() {
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #FFF;
  display: flex;
  flex-flow: column;
  height: 100%;
  overflow: hidden;
}

</style>
