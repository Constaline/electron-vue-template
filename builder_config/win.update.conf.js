const winInstallConfig = require("./win.install.conf")

const winUpdateConfig = {...winInstallConfig};

winUpdateConfig.nsis = Object.assign(winUpdateConfig.nsis, {
    "oneClick": true,
    "allowToChangeInstallationDirectory": false
})

module.exports = winUpdateConfig
