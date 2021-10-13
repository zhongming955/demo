<!--
 * @Author: your name
 * @Date: 2021-10-09 13:52:35
 * @LastEditTime: 2021-10-12 16:21:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\src\components\FileTree.vue
-->
<template>
  <div 
    class="main"
    v-loading="zipping"
    element-loading-text="正在打包。。。"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-tree
      :props="props"
      :ref="(ref) => (tree = ref)"
      show-checkbox
      check-on-click-node
      node-key="path"
      lazy
      :load="loadFiles"

    >
      <template #default="{ data }">
        <span class="custom-tree-node">
          <el-icon>
            <files v-if="data.isFile" />
            <folder v-else />
          </el-icon>
          {{ data.name }}
        </span>
      </template>
    </el-tree>
    <footer>
      <el-button @click="zip">压缩</el-button>
    </footer>
  </div>
</template>

<script>
import { ElTree, ElIcon, ElButton, ElMessage} from "element-plus";
import { Files, Folder } from "@element-plus/icons";
import { inject, ref, toRaw, watch} from "vue";
import zipTree from "../utils/zipTree";
const fs = window.require("fs/promises");
const { ipcRenderer } = window.require("electron");
const path = window.require("path");
export default {
  name: "FileTree",
  components: { ElTree, ElIcon, Files, Folder, ElButton },
  data() {
    return {
      props: {
        label: "name",
        children: "dir",
        isLeaf: "isLeaf",
      },
    };
  },
  setup() {
    const dirPath = inject('dirPath')

    const zipping = ref(false);
    const tree = ref(0);
    // 读取文件树
    const getTreeData = async(cPath) => {
        try {
          const dir =  await fs.opendir(cPath);
          const cData = [];
          // 将文件列表转为树形格式
          for await (const dirent of dir) {
            cData.push({
              name: dirent.name,
              path: path.join(cPath, dirent.name),
              isLeaf: dirent.isFile(),
              isFile: dirent.isFile(),
            });
          }
          return cData
        } catch (error) {
          ElMessage({message:'获取目录失败',type:'error'})
          return ([])
        }
    }
    // tree load 方法
    const loadFiles = async(node, resolve) => {
      console.log(tree.value)
      let cPath = node?.data?.path ? node.data.path : dirPath.value;
      let cData = await getTreeData(cPath)
      resolve(cData) 
    };
    watch( dirPath,async()=>{
      console.log(dirPath)
      const data = await getTreeData(dirPath.value)
      tree.value.root.setData(data)
    })
    // 压缩指令
    const zip = () => {
      zipping.value = true;
      const fileList = toRaw(tree.value.getCheckedNodes());
      zipTree(fileList, dirPath.value)
        .then(() => {
          ElMessage({ message: "打包成功！", type: "success" });
          zipping.value = false
          ipcRenderer.send('openDir',dirPath.value)
          setTimeout(()=>{
            ipcRenderer.send('closeApp')
          },1000)
        })
        .catch(() => {
          zipping.value = false;
          ElMessage({
            message: "打包失败",
            type: "error",
          });
        });
    };
    return {  loadFiles, zip, tree, zipping };
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-flow: column;
  flex: 1;
  overflow: hidden;
  .el-tree {
    flex: 1;
    height: 100%;
    overflow: auto;
  }
  footer {
    height: 60px;
  }
}
</style>