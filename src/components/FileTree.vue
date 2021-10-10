<!--
 * @Author: your name
 * @Date: 2021-10-09 13:52:35
 * @LastEditTime: 2021-10-09 17:02:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\src\components\FileTree.vue
-->
<template>
  <el-tree
    :data="data"
    :props="props"
    :ref='(ref)=>tree = ref'
    show-checkbox
    node-key="path"
    lazy
    :load="loadFiles"
  >
  <template #default="{data}">
    <span class="custom-tree-node">
      <el-icon>
        <files v-if="data.isFile"  />
        <folder v-else/>
      </el-icon>
      {{data.name}}
    </span>
  </template>
  </el-tree>
  <footer>
    <el-button @click="zip">压缩</el-button>
  </footer>
</template>

<script>
import { ElTree ,ElIcon,ElButton} from "element-plus";
import {Files, Folder} from '@element-plus/icons'
import { onMounted, reactive, ref ,toRaw,toRefs} from "vue";
const fs = window.require("fs/promises");
const path = window.require("path");
export default {
  name: "FileTree",
  components: { ElTree,ElIcon, Files, Folder,ElButton},
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
    let dirPath = "E:\\1zhongming";
    const data = reactive([]);
    const tree = ref(0)
    const loadFiles = async (node, resole) => {
      let cData = []
      let cPath = node?.data?.path? node.data.path : dirPath
      const dir = await fs.opendir(cPath);
      for await (const dirent of dir) {
        cData.push({
          name: dirent.name,
          path: path.join(cPath, dirent.name),
          isLeaf: dirent.isFile(),
          isFile: dirent.isFile()
        });
        console.log(dirent.name, dirent.isFile());
      }
      resole(cData) 
    };
    const zip = ()=> {
      const fileList = toRaw(tree.value.getCheckedNodes())
      window.creatZip(fileList)

    }
    return { data, loadFiles,zip,tree };
  },
};
</script>

<style lang="scss" scoped>
.el-tree {
  flex: 1;
  height: 100%;
  overflow: auto;
}
footer {
  height: 60px;
}
</style>