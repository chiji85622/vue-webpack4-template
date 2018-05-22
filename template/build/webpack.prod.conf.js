/**
 * webpack生产模式配置
 */
const path                 = require('path');
const utils                = require('./utils');
const webpack              = require('webpack');
const config               = require('../config');
const merge                = require('webpack-merge');
const baseWebpackConfig    = require('./webpack.base.conf');
const CopyWebpackPlugin    = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin    = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin       = require('uglifyjs-webpack-plugin');
const { VueLoaderPlugin }  = require('vue-loader');

const env = process.env.NODE_ENV === 'testing' ? require('../config/test.env') : require('../config/prod.env');

const entry = utils.getEntry();

const webpackConfig = merge(baseWebpackConfig, {
	mode: 'production',
	entry,
	output: {
		path         : config.build.assetsRoot,
		filename     : utils.assetsPath('./js/[name].[chunkhash].js'),
		chunkFilename: utils.assetsPath('./js/[name].[chunkhash].js')
	},
	module: {
		rules: utils.styleLoaders({
			sourceMap : config.build.productionSourceMap,
			extract   : true,
			usePostCSS: true
		})
	},
	devtool: config.build.productionSourceMap ? config.build.devtool : false,
	optimization: {
		splitChunks: {
			name:'vendors',
			chunks: 'initial', // 只对入口文件处理
			cacheGroups: {
				vendor: {
					test    : /node_modules\//,
					name    : 'vendor',
					priority: 10,
					enforce : true
				},
				commons: {
					// 将common下的组件打包--先待定放着
					test    : /common\/|components\//,
					name    : 'commons',
					priority: 10,
					enforce : true
				}
			}
		},
		runtimeChunk: {
			name: 'manifest'
		},
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: {
						warnings: false
					}
				},
				sourceMap: config.build.productionSourceMap,
				parallel: true
			}),
			new OptimizeCSSPlugin({
				cssProcessorOptions: config.build.productionSourceMap
					? { safe: true, map: { inline: false } }
					: { safe: true }
			})
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': env
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash].css'
		}),

		...utils.getOutputHtml(entry,{
			template: process.env.NODE_ENV === 'testing' ? 'index.html' : config.build.index,
			inject: true,
			minify: {
				removeComments       : true,
				collapseWhitespace   : true,
				removeAttributeQuotes: true
			},
			chunksSortMode: 'dependency'
		}),
		//hash模块id-保持模块id稳定
		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		//静态文件复制
		new CopyWebpackPlugin([
			{
				from  : path.resolve(__dirname, '../static'),
				to    : config.build.assetsStaticDirectory,
				ignore: [ '.*' ]
			}
		])
	]
});

//gzip压缩-需添加compression-webpack-plugin包
if (config.build.productionGzip) {
	const CompressionWebpackPlugin = require('compression-webpack-plugin');

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			asset    : '[path].gz[query]',
			algorithm: 'gzip',
			test     : new RegExp('\\.(' + config.build.productionGzipExtensions.join('|') + ')$'),
			threshold: 10240,
			minRatio : 0.8
		})
	);
}

//包分析工具
if (config.build.bundleAnalyzerReport) {
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;