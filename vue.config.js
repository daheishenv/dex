// vue.config.js

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
var webpack = require('webpack') //引入webpack库

let proxyEnv = { // 代理控制
  '/api': {
    target: `http://${process.env.VUE_APP_BASEURL}:${process.env.VUE_APP_PORT1}`,
    // target: 'https://newdex.340wan.com',
    ws: false,
    changeOrigin: true
  },
}
if (process.env.VUE_APP_CURRENTMODE === 'tron') {
  proxyEnv = { // 代理控制
    '/tronapi': {
      target: `http://${process.env.VUE_APP_BASEURL}:${process.env.VUE_APP_PORT1}`,
      // target: 'https://tron.340wan.com',
      ws: false,
      changeOrigin: true
    },
  }
}

module.exports = {
  // 配置项
  // 开启esLint
  // 开发服务配置
  devServer: {
    open: true,
    port: process.env.SERVER_PORT,
    proxy: proxyEnv
  },
  css:{
    extract: false, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps
    requireModuleExtension: true // 启用 CSS modules for all css / pre-processor files.
  },
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch');

    // 或者
    // 修改它的选项：
    // config.plugin('prefetch').tap(options => {
    //   options[0].fileBlacklist = options[0].fileBlacklist || []
    //   options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
    //   return options
    // })
  },
  configureWebpack: config => {
    // 开启gzip压缩
    if (isProduction) {
      config.plugins.push(
        new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /zh-cn/,
      ));
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.json$|\.css/,
        threshold: 10240,
        minRatio: 0.8
      }));
      // 开启分离js
      // config.optimization = {
      //   runtimeChunk: 'single',
      //   splitChunks: {
      //     chunks: 'async',
      //     maxInitialRequests: Infinity,
      //     minSize: 20000,
      //     cacheGroups: {
      //       vendor: {
      //         test: /[\\/]node_modules[\\/]/,
      //         name (module) {
      //           // get the name. E.g. node_modules/packageName/not/this/part.js
      //           // or node_modules/packageName
      //           const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
      //           // npm package names are URL-safe, but some servers don't like @ symbols
      //           return `npm.${packageName.replace('@', '')}`
      //         }
      //       }
      //     }
      //   }
      // };
      // 取消webpack警告的性能提示
      // config.performance = {
      //   hints:'warning',
      //       //入口起点的最大体积
      //       maxEntrypointSize: 50000000,
      //       //生成文件的最大体积
      //       maxAssetSize: 30000000,
      //       //只给出 js 文件的性能提示
      //       assetFilter: function(assetFilename) {
      //     return assetFilename.endsWith('.js');
      //   }
      // }
    }
  },
  // 资源文件目录
  publicPath: isProduction ? 'https://nds.340wan.com/' : '/',
  // 将构建好的文件输出到位置
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
	assetsDir: 'static',
  indexPath: 'index.html',
  // 是否为生产环境构建生成 source map？
  productionSourceMap: false,

  // 三方插件的选项
  pluginOptions: {
    // ...
  },
}
