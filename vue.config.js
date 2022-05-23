'use strict'
const path = require('path') // 路径操作
const defaultSettings = require('./src/settings.js') // 全局参数配置

// 拼接路径
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title // 网站标题
const port = 8013 // 端口

module.exports = {
  // publicPath: process.env.NODE_ENV === 'development' ? '/' : '/prod-path/', // 区分开发环境
  publicPath: '/', // 部署应用时的基础路径
  outputDir: 'dist', // 打包生成路径
  assetsDir: 'static', // 静态资源生成路径 /dist/static/
  lintOnSave: process.env.NODE_ENV === 'development', // 每次保存时是否启用 lint 检查代码
  productionSourceMap: false, // 生产环境下是否生成 .map 定位语句在项目中的位置
  devServer: { // 开发服务器
    port: port, // 端口
    // open: true, // 项目启动时自动打开浏览器
    overlay: { // 浏览器页面 显示编译错误和警告
      warnings: false,
      errors: true
    },
    proxy: { // 代理
      '/api': { // 本地路径
        target: process.env.VUE_APP_BASE_API, // 目标接口路径
        changeOrigin: true, // 支持跨域
        pathRewrite: {
          '^/api': 'api' // 重写路径
        }
      },
      '/auth': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/auth': 'auth'
        }
      }
    }
  },
  configureWebpack: { // Webpack 简单配置
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: { // 路径别名
        '@': resolve('src'),
        '@crud': resolve('src/components/Crud')
      }
    }
  },
  chainWebpack(config) { // Webpack 细粒度配置
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons')) // 图标放行
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons')) // 渲染.svg图标
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true // 保留元素之间空格
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}
