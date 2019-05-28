# crawler-test
爬虫尝试：koa+puppeteer+mongodb+vue-cli3

## 使用技术
- koa中间件
- puppeteer爬虫
- 使用async.eachSeries处理同步插值进数据库
- mongodb数据库
- vue-cli3

## 运行
数据库：
把根目录下的crawler.db文件导入到mongodb数据库，并在本地开启mongo服务

开启后端
- 根目录下执行：`npm i`
- 根目录下执行` npm start`
  
开启前端：
- 进入front-end目录，执行`npm i`后，执行`npm serve`
- 网页上打开：`http://localhost:3001`

开启爬虫，抓取数据到数据库：
- 执行下一步之前，先开启后端相关端口：`npm start`
- 根目录下执行：`npm run crawler`

## 目录结构
```js
.
├── LICENSE
├── README.md
├── app.js // 后台启动文件
├── controller.js // 数据库操作
├── controllers
│   ├── sort.js // 分类列表
│   └── video.js // 视频列表
├── crawler // 爬虫例子
│   ├── form.js // 表单输入
│   ├── getPage.js // 爬取页面
│   ├── index.js // 爬取数据到数据库
│   ├── shot.js // 截屏，生成pdf
│   ├── test.js // 爬取数据到文件
│   ├── trace.js // 性能分析
│   ├── uitest.js // ui测试
│   └── update.js // 版本更新
├── front-end // 前端目录
├── issue.md
├── package.json
├── schemas // 数据库schema
│   ├── sort.js
│   └── video.js
└── test // 测试生成的文件
```