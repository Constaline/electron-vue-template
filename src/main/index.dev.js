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
const { app, session } = require('electron');
const path = require('path');
app.on('ready', async () => {
    let vueDevtoolsPath = path.join(__static, 'vue_devtools');
    await session.defaultSession.loadExtension(
        vueDevtoolsPath,
        // allowFileAccess 是在 file://URL 上加载devtools扩展所需的配置。
        { allowFileAccess: true }
    )
})

// Require `main` process to boot app
require('./index')
