let { name, author } = require("../package.json");

let baseConfig = {
    "productName": `${name}`,
    "appId": `com.${author}.electronvue`,
    "npmRebuild": false,
    "asarUnpack": [
        "**/*.jsc"
    ],
    "directories": {
        "output": "build"
    },
    "files": [
        "dist/electron/**/*",
        // 此处添加 README.md 用于 asarmor 中损毁文件
        "README.md",
    ],
    "publish": [
        {
            "provider": "generic",
            "url": ""
        }
    ]
}

// 注册钩子
let hooks = {
    "afterPack": "builder_config/hooks/afterPack.js",
}
  
baseConfig = Object.assign(baseConfig, hooks)

module.exports = baseConfig
