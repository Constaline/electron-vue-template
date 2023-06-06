/**
 * 设置在生产环境中 `__static` 的路径 
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
 if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

/**
* 修正 vscode 调试主进程时 __static 丢失问题
* 
* 一般情况下 webpack.DefinePlugin 会处理开发模式下 __static 的路径，
* 但是使用 vscode 调试主进程时没有经过 webpack 处理，需要手动指定 __static
*/
if (!global.__static && process.env.NODE_ENV == 'development') {
  global.__static = require('path').join(__dirname, '../../static').replace(/\\/g, '\\\\')
}


const { app } = require('electron');
// 禁用手势缩放
app.commandLine.appendSwitch('disable-pinch');

// 当设置 disable-site-isolation-trials 标志时，扩展程序会中断
// https://github.com/electron/electron/issues/23662#issuecomment-868746824
// https://github.com/electron/electron/issues/29052
// 禁用Chrome同源安全策略，处理由于 file 协议产生的 iframe 跨域问题
// app.commandLine.appendSwitch('disable-site-isolation-trials')

// 增加最大内存占用量
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=2048');

/**
 * 注册@electron/remote模块
 * https://github.com/electron/remote 
 */
require('@electron/remote/main').initialize();

require('./app');