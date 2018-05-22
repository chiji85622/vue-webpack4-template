'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  // 入口配置：glob的规则配置路径 
  // eg. ./src/page/*/*.js
  entry:'./src/page/*/index.js',

  dev: {
    // 资源路径
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // 代理表
    proxyTable: {},

    // dev-server配置
    host: 'localhost', // 可以被process.env.HOST覆盖
    port: 8080, // 可以被 process.env.PORT覆盖, 如果端口在使用中，将获取一个空闲的端口
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,

    // 如果使用eslint-loader，错误将在控制台中打印
    useEslint: true,
    // eslint的错误是否被覆盖显示在浏览器中
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // Source Maps方式，为开发环境中最快的
    devtool: 'cheap-module-eval-source-map',

    // 如果测试有问题，设置成false
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,
  },

  build: {
    // html模板
    index: path.resolve(__dirname, '../index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: '../',
    assetsStaticDirectory:'static',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip压缩
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // 包分析
    // `npm run build --report`
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
