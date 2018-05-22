/**
 * webpack基础配置
 */

const path                = require("path");
const utils               = require("./utils");
const config              = require("../config");
const vueLoaderConfig     = require("./vue-loader.conf");
const { VueLoaderPlugin } = require("vue-loader");

/**
 * 解析路径
 * @param dir 文件夹
 * @returns {string} 返回路径
 */
function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

/**
 * esLint规则
 * @returns {object}
 */
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: "eslint-loader",
  enforce: "pre",
  include: [resolve("src"), resolve("test")],
  options: {
    formatter: require("eslint-friendly-formatter"),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

module.exports = {
  context: path.resolve(__dirname, "../"),
  output: {
    path    : config.build.assetsRoot,
    filename: "[name].js",
    publicPath:
      process.env.NODE_ENV === "production"
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      "@" : resolve("src"),
      "@static" : resolve("static")
    }
  },
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test   : /\.vue$/,
        loader : "vue-loader",
        options: vueLoaderConfig
      },
      {
        test   : /\.js$/,
        loader : "babel-loader",
        include: [
          resolve("src"),
          resolve("test"),
          resolve("node_modules/webpack-dev-server/client")
        ]
      },
      {
        test   : /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader : "url-loader",
        options: {
          limit: 10000,
          name : utils.assetsPath("static/img/[name].[hash: 7].[ext]")
        }
      },
      {
        test   : /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader : "url-loader",
        options: {
          limit: 10000,
          name : utils.assetsPath("static/media/[name].[hash: 7].[ext]")
        }
      },
      {
        test   : /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader : "url-loader",
        options: {
          limit: 10000,
          name : utils.assetsPath("static/fonts/[name].[hash: 7].[ext]")
        }
      }
    ]
  },
  node: {
    // 因为VUE源包含它，所以阻止WebPACK注入无用的SeMeTimeTube填充（虽然仅使用它）
    setImmediate : false,
    // 防止WebPACK向客户端本地模块注入模拟，这对于客户端来说是没有意义
    dgram        : "empty",
    fs           : "empty",
    net          : "empty",
    tls          : "empty",
    child_process: "empty"
  }
};
