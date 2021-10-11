<!--
 * @Author: your name
 * @Date: 2021-10-09 13:52:35
 * @LastEditTime: 2021-10-11 17:05:33
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
      :data="data"
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
import { reactive, ref, toRaw } from "vue";
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
    let dirPath = JSON.parse(ipcRenderer.sendSync("getZipInfo")).path;
    const zipping = ref(false);
    const data = reactive([]);
    const tree = ref(0);
    // 读取文件树
    const loadFiles = async (node, resole) => {
      let cData = [];
      let cPath = node?.data?.path ? node.data.path : dirPath;
      const dir = await fs.opendir(cPath);
      // 将文件列表转为树形格式
      for await (const dirent of dir) {
        cData.push({
          name: dirent.name,
          path: path.join(cPath, dirent.name),
          isLeaf: dirent.isFile(),
          isFile: dirent.isFile(),
        });
      }
      resole(cData);
    };
    // 压缩指令
    const zip = () => {
      zipping.value = true;
      const fileList = toRaw(tree.value.getCheckedNodes());
      zipTree(fileList, dirPath)
        .then(() => {
          ElMessage({ message: "打包成功！", type: "success" });
          zipping.value = false
          ipcRenderer.send('openDir',dirPath)
          setTimeout(()=>{
            ipcRenderer.send('closeApp')
          },1000)
        })
        .catch((err) => {
          zipping.value = false;
          ElMessage({
            message: "打包失败",
            type: "error",
          });
        });
    };
    return { data, loadFiles, zip, tree, zipping };
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