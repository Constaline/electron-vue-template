'use strict'

process.env.BABEL_ENV = 'renderer'

const path = require('path')
const { dependencies, version, revision } = require('../package.json')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const TerserPlugin = require('terser-webpack-plugin');

const glob = require('glob')
// 取得相应的页面路径
const PAGE_PATH = path.resolve(__dirname, '../src/renderer/pages')
// 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，
// 如果该文件存在，那么就作为入口处理
const getEntries = () => {
    let entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
    let map = {}
    //console.log('entryFiles:',entryFiles)
    entryFiles.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        map[filename] = filePath
    })
    //console.log('entryMap:', map);
    return map
}
/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
let whiteListedModules = ['vue', 'element-ui']

let rendererConfig = {
    devtool: '#cheap-module-eval-source-map',
    // entry: getEntries(),
    entry: {
        renderer: path.join(__dirname, '../src/renderer/main.js')
    },
    externals: [
        ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
    ],
    module: {
        rules: [
            {
                test: /\.less$/,
                // use: ['vue-style-loader', 'css-loader', 'less-loader']
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                // use: ['vue-style-loader', 'css-loader']
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.html$/,
                use: 'vue-html-loader'
            },
            {
                test: /\.js$/,
                use: [
                    'thread-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: process.env.NODE_ENV !== 'production'
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            },
            {
                test: /\.vue$/,
                use: [
                    'thread-loader',
                    {
                        loader: 'vue-loader',
                        options: {
                            extractCSS: process.env.NODE_ENV === 'production',
                            loaders: {
                                sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
                                scss: 'vue-style-loader!css-loader!sass-loader',
                                less: 'vue-style-loader!css-loader!less-loader'
                            },
                            cacheDirectory: process.env.NODE_ENV === 'production' ? undefined : path.resolve(__dirname, '../node_modules/.cache/vue-loader'), // 缓存
                            cacheIdentifier: process.env.NODE_ENV === 'production' ? undefined : `cache-loader:${version}_${process.env.NODE_ENV}`
                        }
                    }]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'imgs/[name]--[folder].[ext]'
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name]--[folder].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'fonts/[name]--[folder].[ext]'
                    }
                }
            }
        ]
    },
    node: {
        __dirname: process.env.NODE_ENV !== 'production',
        __filename: process.env.NODE_ENV !== 'production'
    },
    plugins: [
        new VueLoaderPlugin(),
        // new MiniCssExtractPlugin({filename: 'styles.css'}),
        // 分离css
        new MiniCssExtractPlugin({ filename: '[name].css' }), // 按入口名生成样式文件，避免冲突
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.ejs'),
            templateParameters(compilation, assets, options) {
                return {
                    compilation: compilation,
                    webpack: compilation.getStats().toJson(),
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        files: assets,
                        options: options
                    },
                    process,
                };
            },
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: process.env.NODE_ENV !== 'production'
                ? path.resolve(__dirname, '../node_modules')
                : false
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '../dist/electron')
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src/renderer'),
            // 增加 @pages 别名，读取 src/renderer/page 文件夹
            '@pages': path.join(__dirname, '../src/renderer/pages'),
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.vue', '.json', '.css', '.node']
    },
    target: 'electron-renderer',
}

// // 处理html入口，与上面的入口配置基本相同，读取pages文件夹下的对应的html后缀文件
// Object.keys(rendererConfig.entry).forEach(key => {
//     const plugin = new HtmlWebpackPlugin({
//         filename: key + '.html',
//         // template: `${PAGE_PATH}/${key}/index.ejs`,
//         template: path.resolve(__dirname, '../src/index.ejs'), // 采用src/index.ejs为公共模版
//         /**
//          * 2020/02/28 增加 templateParameters 
//          * 修正在高版本 node 编译出现 process 丢失问题
//          */
//         templateParameters(compilation, assets, options) {
//             return {
//                 compilation: compilation,
//                 webpack: compilation.getStats().toJson(),
//                 webpackConfig: compilation.options,
//                 htmlWebpackPlugin: {
//                     files: assets,
//                     options: options
//                 },
//                 process
//             };
//         },
//         minify: {
//             collapseWhitespace: true,
//             removeAttributeQuotes: true,
//             removeComments: true
//         },
//         chunks: ['vendor', key, 'components'],
//         nodeModules: process.env.NODE_ENV !== 'production'
//             ? path.resolve(__dirname, '../node_modules')
//             : false
//     })
//     rendererConfig.plugins.push(plugin)
// })

/**
 * Adjust rendererConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
    rendererConfig.plugins.push(
        new webpack.DefinePlugin({
            '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
        })
    )
}

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
    rendererConfig.devtool = ''

    rendererConfig.plugins.push(
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, '../static'),
                to: path.join(__dirname, '../dist/electron/static'),
                ignore: ['.*']
            }
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
    )

    rendererConfig.optimization = {
        minimize: true,
        minimizer: [new TerserPlugin()],
    }
}

module.exports = rendererConfig
