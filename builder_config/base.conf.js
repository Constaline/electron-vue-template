let { name, author } = require("../package.json");

let baseConfig = {
    "productName": `${name}`,
    "appId": `com.${author}.electronvue`,
    "npmRebuild": false,
    "directories": {
        "output": "build"
    },
    "files": [
        "dist/electron/**/*"
    ],
    "publish": [
        {
            "provider": "generic",
            "url": ""
        }
    ]
}

module.exports = baseConfig
