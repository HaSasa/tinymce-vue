require('events').EventEmitter.defaultMaxListeners = 0
const isProduction = process.env.NODE_ENV === 'production'
const vueConfig = {
  // 静态资源
  assetsDir: isProduction ? '/static' : './',
  devServer: {
    disableHostCheck: true,
    port: 8088,
    proxy: {
      '/api': {
        target: 'https://www.needing.xin',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
}

module.exports = vueConfig
