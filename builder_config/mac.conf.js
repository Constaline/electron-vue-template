const baseConfig = require("./base.conf")

let macConfig = Object.assign(baseConfig, {
    "dmg": {
        "contents": [
            {
                "x": 410,
                "y": 150,
                "type": "link",
                "path": "/Applications"
            },
            {
                "x": 130,
                "y": 150,
                "type": "file"
            }
        ]
    },
    "mac": {
        "icon": "build/icons/icon.icns"
    }
})


module.exports = macConfig
