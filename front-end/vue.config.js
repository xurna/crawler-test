const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/'
  : '/',
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  },
  chainWebpack: config => {
    config.resolve.alias
            .set('js',resolve('src/assets/js'))
            .set('images',resolve('src/assets/images'))
            .set('less',resolve('src/assets/less'))
            .set('comp',resolve('src/components'))
            .set('views',resolve('src/views'));

    // 移除 prefetch 插件
    config.plugins.delete('prefetch');

    config.module
      .rule('images')
        .use('url-loader')
          .loader('url-loader')
          .tap(options => Object.assign(options, { limit: 5120 })); // 5k

  }
}