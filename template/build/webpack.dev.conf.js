/**
 * webpack开发模式配置
 */

const utils                = require('./utils');
const webpack              = require('webpack');
const config               = require('../config');
const merge                = require('webpack-merge');
const path                 = require('path');
const baseWebpackConfig    = require('./webpack.base.conf');
const CopyWebpackPlugin    = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder           = require('portfinder');
const { VueLoaderPlugin }  = require('vue-loader');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const entry = utils.getEntry();

const devWebpackConfig = merge(baseWebpackConfig, {
	mode: 'development',
	entry,
	module: {
		rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
	},
	devtool: config.dev.devtool,
  // 自定义devServer配置在/config/index.js
	devServer: {
		clientLogLevel: 'warning',
		historyApiFallback: {
			rewrites: [ { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') } ]
		},
		hot: true,
		// 使用了CopyWebpackPlugin，所以关闭
		contentBase: false,
		compress   : true,
		host       : HOST || config.dev.host,
		port       : PORT || config.dev.port,
		open       : config.dev.autoOpenBrowser,
		overlay    : config.dev.errorOverlay ? { warnings: false, errors: true }: false,
		publicPath : config.dev.assetsPublicPath,
		proxy      : config.dev.proxyTable,
		// 友好错误的必要条件
		quiet: true,
		watchOptions: {
			poll: config.dev.poll
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': require('../config/dev.env')
		}),
		new VueLoaderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		// 在控制台上显示更新的正确文件名。
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),

		...utils.getOutputHtml(entry,{
			template: process.env.NODE_ENV === 'testing' ? 'index.html' : config.build.index,
			inject: true,
		}),

		// 复制静态文件
		new CopyWebpackPlugin([
			{
				from  : path.resolve(__dirname, '../static'),
				to    : config.build.assetsStaticDirectory,
				ignore: [ '.*' ]
			}
		])
	]
});

module.exports = new Promise((resolve, reject) => {
	portfinder.basePort = process.env.PORT || config.dev.port;
	portfinder.getPort((err, port) => {
		if (err) {
			reject(err);
		} else {
			// 发布新端口，e2e测试必备
			process.env.PORT = port;
			// webpackDevConfig配置添加端口
			devWebpackConfig.devServer.port = port;

			// 添加友好的错误提示
			devWebpackConfig.plugins.push(
				new FriendlyErrorsPlugin({
					compilationSuccessInfo: {
						messages: [
							`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`
						]
					},
					onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined
				})
			);

			resolve(devWebpackConfig);
		}
	});
});
