/**
 * 工具
 */

const path                 = require("path");
const glob                 = require("glob");
const HtmlWebpackPlugin    = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config               = require("../config");
const packageConfig        = require("../package.json");

/**
 * 获取资源的绝对路径
 * @param _path {string|array} 相对路径
 * @returns {string} 绝对路径
 */
exports.assetsPath = function(_path) {
  const assetsSubDirectory =
    process.env.NODE_ENV === "production"
      ? config.build.assetsSubDirectory
      : config.dev.assetsSubDirectory;

  return path.posix.join(assetsSubDirectory, _path);
};

/**
 * 创建css-loader
 * @param sourceMap   {boolean} 是否开启源码映射表
 * @param extract     {boolean} 是都开启提取css
 * @param usePostCSS  {boolean} 是否使用PostCSS
 * @returns {object} css-loader配置
 */
exports.cssLoaders = function({
  sourceMap = false,
  extract = false,
  usePostCSS = false
}) {
  const cssLoader = {
    loader: "css-loader",
    options: {
      sourceMap: sourceMap,
      //css module
      modules: true,
      localIdentName: "[local]_[hash:base64:8]"
    }
  };

  const postcssLoader = {
    loader: "postcss-loader",
    options: {
      sourceMap: sourceMap
    }
  };

  /**
   * 生成loader
   * @param loader css预处理名
   * @param loaderOptions loader配置
   * @returns {*}
   */
  function generateLoaders(loader, loaderOptions) {
    const loaders = usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: sourceMap
        })
      });
    }

    if (extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders);
    } else {
      return ["vue-style-loader"].concat(loaders);
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders("less"),
    sass: generateLoaders("sass", { indentedSyntax: true }),
    scss: generateLoaders("sass"),
    stylus: generateLoaders("stylus"),
    styl: generateLoaders("stylus")
  };
};

/**
 * 创建style-loader
 * @param options 配置-见css-loader配置
 * @returns {Array}
 */
exports.styleLoaders = function(options) {
  const output = [];
  const loaders = exports.cssLoaders(options);

  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp("\\." + extension + "$"),
      use: loader
    });
  }

  return output;
};

/**
 * 创建通知回调-用于dev模式热更新
 * @returns {Function}
 */
exports.createNotifierCallback = () => {
  const notifier = require("node-notifier");

  return (severity, errors) => {
    if (severity !== "error") return;

    const error = errors[0];
    const filename = error.file && error.file.split("!").pop();

    notifier.notify({
      title: packageConfig.name,
      message: severity + ": " + error.name,
      subtitle: filename || "",
      icon: path.join(__dirname, "logo.png")
    });
  };
};

/**
 * 获取入口配置
 */
exports.getEntry = function() {
  const srcs = glob.sync(config.entry);
  let entry = {};

  srcs.forEach(src => {
    const chunk = src
      .split("/")
      .slice(3, -1)
      .map(
        (value, key) =>
          key === 0
            ? value
            : value.substring(0, 1).toUpperCase() + value.substring(1)
      )
      .join("")||'main';

    entry[chunk] = src;
  });

  return entry;
};

/**
 * 创建输出Html配置
 * @param {object} entry 入口文件
 * @param {object} options htmlWebpack配置
 */
exports.getOutputHtml = function(entry, options) {
  let res = [];

  const getTemplate=function(src){
    if(config.build.index!=='m'){
      return  process.env.NODE_ENV === 'testing' ? 'index.html' : config.build.index;
    }
    
    return src.replace(/js$/,'pug')
  }

  for (let chunk in entry) {
    console.log(getTemplate(entry[chunk]))
    res.push(
      new HtmlWebpackPlugin({
        ...options,
        template:getTemplate(entry[chunk]),
        chunks: [chunk,'vendors','manifest'],
        filename: `html/${chunk}.html`,
      })
    );
  }

  return res;
};
