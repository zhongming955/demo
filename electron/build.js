/*
 * @Author: your name
 * @Date: 2021-09-17 15:31:29
 * @LastEditTime: 2021-09-17 16:00:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue\demo\electron\build.js
 */
export default {
    "appId": "xxxx", //app标识
    "productName": "demo", // 打包名称
    "copyright": "Copyright @ year ${author}", // 版权
    "compression": "store", // 压缩级别 "store" | "normal"| "maximum"
    "directories": {
        "output": "build" // 输出文件夹与package.json同级
    },
    "asar": false, // 使用asar压缩
    "files": [
        {
            "form": "./dist",
            "to":"/"
        }
    ],
    "extraResources": { // 拷贝指定静态文件到指定位置
        "from": "./extraResources",
        "to": "extraResources"
    },
    "win": {
        "icon": "./electron/icon.ico", // exe文件图标
        "target": [
            {
                "target": "nsis",  //打包目标
                "arch": [ // 打包版本
                    "ia32"
                ]
            }
        ],
        "extraResources": {
            "from": "./extraResources",
            "to": "extraResources"
        }
    },
    "nsis": {
        "oneClick": false, // 一键安装
        "guid": "xxxx", // 注册表名称
        "perMachine": true, // 安装时权限限制
        "allowElevation":true, // 允许请求提升
        "allowToChangeInstallationDirectory": true, // 允许修改安装目录
        "installerIcon": "./electron/icon.ico", // 安装图标
        "uninstallerIcon": "./electron/icon.ico", //卸载图标
        "installerHeaderIcon": "./electron/icon.ico", // 安装时头部图标
        "createDesktopShortcut": true, // 创建桌面图标
        "createStartMenuShortcut": true, // 创建开始菜单图标
        "shortcutName": "xxxx" // 图标名称
    }

}
