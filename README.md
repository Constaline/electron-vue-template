# electron-vue-template


## 快速起步

``` bash
npm install

# 运行开发环境
npm start / npm run dev 

# 编译打包win安装文件
npm run build:win

# 编译打包win升级文件
npm run build:win_update

# 编译打包mac安装文件
npm run build:mac
```

<br/>

## 安装依赖注意事项
###  Windows 环境
1.安装 node 编译工具
```bash 
npm i -g node-gyp node-pre-gyp
```

2.安装 `windows-build-tools` (需要以管理员模式运行命令行)
```bash 
# win7
set "PYTHON_MIRROR=http://npm.taobao.org/mirrors/python" && npm install --global --production windows-build-tools --vs2015

# win10
set "PYTHON_MIRROR=http://npm.taobao.org/mirrors/python" && npm install --global --production windows-build-tools
# 注意：
# win10安装后需要打开'Visual Studio Installer'，
# 选择'Visual Studio 15 生成工具 2017'后点击修改，
# 勾选'适用于桌面的 VC++ 2015.3 v14.00 (v140) 工具集'后点击确定
```

3.执行 `npm install` 命令安装依赖

<br/>

### MacOS 环境
1.安装 node 编译工具
```bash 
npm i -g node-gyp node-pre-gyp
```

2.安装`XCode Command Line Tools`
```bash
#执行命令安装
xcode-select --install
```

3.执行 `npm install` 命令安装依赖

<br/>

## VSCode 调试主进程方法

1.在主进程代码(`src/main`)中加入断点。

2.在 VSCode 里面，点击“调试”图标。选择`Electron_Main`配置，点击“调试并运行”

<br/>

