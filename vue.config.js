// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      // 配置跨域，请求后端接口
      '/api': {
        target: 'https://www.bilibili.com',//源地址
        changeOrigin: true,//是否允许跨域
        // ws: false,//是否代理websockets
        pathRewrite: {
          '^/api': ''
        }
      },
      '/hot': {
        target: 'https://s.search.bilibili.com',
        changeOrigin: true,
        pathRewrite: {
          '^/hot': ''
        }
      },
      '/bbsearch': {
        target: 'https://api.bilibili.com',
        changeOrigin: true,
        pathRewrite: {
          '^/bbsearch': ''
        }
      }
      /* '/defaultsearch': {
        target: 'http://api.bilibili.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/defaultsearch': ''
        }
      }, */

    }
  }
}
