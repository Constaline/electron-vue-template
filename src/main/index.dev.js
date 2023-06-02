/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

// Install `vue-devtools`
require('electron').app.on('ready', () => {
    // TODO: 
    // electron13版本以上废弃了BrowserWindow.addDevToolsExtension方法，需要重写注入

    // require('electron').BrowserWindow.addDevToolsExtension(
    //     require('path').join(__static, 'vue_devtools')
    // )
})

// Require `main` process to boot app
require('./index')
