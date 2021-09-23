<!--
 * @Author: your name
 * @Date: 2021-09-17 10:41:52
 * @LastEditTime: 2021-09-23 10:56:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\src\App.vue
-->
<template>
  <TitleBar></TitleBar>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import TitleBar from './components/TitleBar.vue'
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    TitleBar
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
}
</style>
