
## 应用图标生成方法

### Mac 图标

> 以下步骤需要在mac下执行

1.准备一个 1024 * 1024 的png图片，假设名字为 icon.png

2.命令行 ` mkdir tmp.iconset`，创建一个临时目录存放不同大小的图片

3.把原图片转为不同大小的图片，并放入上面的临时目录


```bash
#全部拷贝到命令行回车执行，执行结束之后去tmp.iconset查看十张图片是否生成好
sips -z 16 16 icon.png --out tmp.iconset/icon_16x16.png
sips -z 32 32 icon.png --out tmp.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png --out tmp.iconset/icon_32x32.png
sips -z 64 64 icon.png --out tmp.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png --out tmp.iconset/icon_128x128.png
sips -z 256 256 icon.png --out tmp.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png --out tmp.iconset/icon_256x256.png
sips -z 512 512 icon.png --out tmp.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png --out tmp.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out tmp.iconset/icon_512x512@2x.png
```

4.通过iconutil生成icns文件

```bash
iconutil -c icns tmp.iconset -o icon.icns
```


### Windows 图标

> 以下步骤可以在win/mac环境下执行

1.安装[imagemagick](http://www.imagemagick.org/script/download.php)

2.按尺寸导出多个PNG文件
```
icon_16.png
icon_32.png
icon_48.png
icon_128.png
icon_256.png
icon_512.png
```

3.使用命令生成ico
```bash
convert icon_*.png icon.ico
```
