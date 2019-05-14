# crawler-test
爬虫尝试：koa+puppeteer+mongodb+vue-cli3

- koa中间件
- puppeteer爬虫
- 使用async.eachSeries处理同步插值进数据库
- mongodb数据库
- vue-cli3

## 运行
数据库：
把根目录下的crawler.db文件导入到mongodb数据库，并在本地开启mongo服务

后端
- 根目录下执行：`npm i`
- 根目录下执行` npm start`
  
前端：
- 进入front-end目录，执行`npm i`后，执行`npm serve`
- 网页上打开：`http://localhost:3001`