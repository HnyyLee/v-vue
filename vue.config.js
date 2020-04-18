const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  // devServer: {
  //   overlay: {
  //     warnings: true,
  //     errors: true
  //   },
  //   port: 5000
  // },
  // lintOnSave: 'error' // 配置: https://cli.vuejs.org/zh/config/#lintonsave
  lintOnSave: false,
  publicPath: '/',
  productionSourceMap: false,
  // 生产环境自动清除console
  configureWebpack: config => {
    config
      .optimization = {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true
              }
            }
          })
        ]
      }
  },
  devServer: {
    port: 8080,
    // proxy: {
    //   '/product':{
    //     target: 'http://localhost:3000',
    //     pathRewrite: { '^/product': '' }
    //   }
    // }
  }
  // devServer: {
  //   contentBase: "./",//本地服务器所加载的页面所在的目录
  //   historyApiFallback: true,//不跳转
  //   host:'localhost',
  //   port:7000,
  //   hot:true,
  //   inline: true,//实时刷新
  //   hot:true,//Enable webpack's Hot Module Replacement feature
  //   compress:true,//Enable gzip compression for everything served
  //   overlay: true, //Shows a full-screen overlay in the browser
  //   stats: "errors-only" ,//To show only errors in your bundle
  //   open:true, //When open is enabled, the dev server will open the browser.
  //   publicPath: '/admin/'
  //   // contentBase: './',
  //   // // clientLogLevel: 'warning',
  //   // // historyApiFallback: true,
  //   // // publicPath: /admin/,
  //   // hot: true,
  //   // compress: true,
  //   // host: 'localhost',
  //   // port: 8080
  // }
  // devServer: {
  //   proxy: {
  //     '/': {
  //       target: '',
  //       pathRewrite: {
  //         '^/': '/admin'
  //       },
  //       changeOrigin: true
  //     }
  //   }
  // }
}
