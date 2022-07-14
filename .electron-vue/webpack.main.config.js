'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

// const BabiliWebpackPlugin = require('babili-webpack-plugin')
// const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const TerserPlugin = require('terser-webpack-plugin');

let mainConfig = {
    entry: {
        main: path.join(__dirname, '../src/main/index.js')
    },
    externals: [
        ...Object.keys(dependencies || {})
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'thread-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: process.env.NODE_ENV !== 'production'
                        }
                    }],
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
    node: {
        __dirname: process.env.NODE_ENV !== 'production',
        __filename: process.env.NODE_ENV !== 'production'
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '../dist/electron')
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        extensions: ['.js', '.json', '.node']
    },
    target: 'electron-main',
    //   optimization: {
    //     minimizer: [
    //         new ParallelUglifyPlugin({ // 多进程压缩
    //             cacheDir: '.cache/',
    //             uglifyJS: {
    //                 output: {
    //                     comments: false,
    //                     beautify: false
    //                 },
    //                 compress: {
    //                     warnings: false,
    //                     drop_console: true,
    //                     collapse_vars: true,
    //                     reduce_vars: true
    //                 }
    //             }
    //         }),
    //     ]
    //   }
}

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
    // 主进程开启符号表，以便调试定位
    mainConfig.devtool = "source-map";
    mainConfig.plugins.push(
        new webpack.DefinePlugin({
            '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
        })
    )
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
    mainConfig.plugins.push(
        // new BabiliWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
        })
    )
    mainConfig.optimization = {
        minimize: true,
        minimizer: [new TerserPlugin()],
    }

}

module.exports = mainConfig
