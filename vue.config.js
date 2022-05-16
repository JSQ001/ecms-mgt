/* eslint-disable */

const path = require('path')
const resolve = dir => path.join(__dirname, dir);
const { name } = require('./package');

module.exports = {
  transpileDependencies: [/node_modules/],
  devServer: {
    port: 8080,
    open: true,
    // proxy: {
    //   '/api/': {
    //     target: 'http://localhost:8989',
    //     changeOrigin: true,
    //   },
    // },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  publicPath: '/ecms-mgt',
  outputDir: 'ecms-mgt',
  configureWebpack: {
    // resolve: {
    //   alias: {
    //     '@': resolve('src')
    //   }
    // },
    // output: {
    //   // 把子应用打包成 umd 库格式
    //   library: `${name}-[name]`,
    //   libraryTarget: 'umd',
    //   jsonpFunction: `webpackJsonp_${name}`
    // }
  },
  chainWebpack: config => {
    // 设置快捷路径， @ 表示 'src' ，components 表示 'src/components'
    config.resolve.alias
      .set('!', resolve('/'))
      .set('@', resolve('src'))

    config.when(process.env.NODE_ENV === 'production',
        // config => config.devtool('cheap-source-map')
         config => config.devtool('source-map') // 转换过的源码-快
        //config => config.devtool('inline-source-map') // 源码-慢
    )
    //config.devtool('inline-source-map')

    config.plugin('html')
        .tap(args => {
          args[0].title= '信息发布系统'
          return args
        })
    //console.log(config.resolve.extensions.store)
    //config.resolve.extensions.store(['.js', 'tsx', '.vue', '.less','.json'])

  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  }

}
