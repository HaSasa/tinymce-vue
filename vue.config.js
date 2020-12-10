require('events').EventEmitter.defaultMaxListeners = 0
const isProduction = process.env.NODE_ENV === 'production'
const vueConfig = {
  // 静态资源
  assetsDir: isProduction ? '/static' : './',
  devServer: {
    disableHostCheck: true,
    port: 80,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/api': {
        target: 'https://www.needing.xin',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      '/xlive': {
        target: 'http://uat-mlive.bilibili.co',
        changeOrigin: true
      },
      '/xlive/internal/live-admin/': {
        target: 'http://uat-mlive.bilibili.co',
        changeOrigin: true
      }
    }
  }
}

module.exports = vueConfig
