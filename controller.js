const fs = require('fs');

// 导入js文件:
function addMapping(router, mapping) {
  for (var url in mapping) {
    if (url.startsWith('GET ')) {
      var path = url.substring(4);
      router.get(path, mapping[url]);
      console.log(`register URL mapping: GET ${path}`);
    } else if (url.startsWith('POST ')) {
      var path = url.substring(5);
      router.post(path, mapping[url]);
    } else if (url.startsWith('PUT ')) {
      var path = url.substring(4);
      router.put(path, mapping[url]);
    } else if (url.startsWith('DELETE ')) {
      var path = url.substring(7);
      router.del(path, mapping[url]);
    } else {
      console.log(`invalid URL: ${url}`);
    }
  }
}

function addControllers(router, dir) {
  // 先导入fs模块，然后用readdirSync列出文件
  // 这里可以用sync是因为启动时只运行一次，不存在性能问题:
  var files = fs.readdirSync(__dirname + '/' + dir);
  var js_files = files.filter((f) => {
    return f.endsWith('.js');
  });

  for (var f of js_files) {
    let mapping = require(__dirname + '/' + dir + '/' + f);
    addMapping(router, mapping);
  }
}

module.exports = function (dir) {
  let
    controllers_dir = dir || 'controllers', // 如果不传参数，扫描目录默认为'controllers'
    router = require('koa-router')();
  addControllers(router, controllers_dir);
  return router.routes();
};