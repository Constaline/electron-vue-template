const baseConfig = require("./base.conf")

const winConfig = Object.assign(baseConfig, {
    "nsis": {
        "oneClick": false,
        "allowToChangeInstallationDirectory": true,
        // perMachine 是安装到所有用户的设置
        "perMachine": true,
        "runAfterFinish": true,
        "allowElevation": true,
        // 应用打包名需要手动进行拼接，
        // 否则会默认读取package.json下的name字段
        "artifactName": `${baseConfig.productName}` + "-${version}.${ext}"
    },
    "win": {
        "icon": "build/icons/icon.ico",
        "target": [
            {
                "target": "nsis",
                "arch": [
                    "x64"
                ]
            }
        ]
    }
})

module.exports = winConfig
