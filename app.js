const Koa = require('koa');
const app = new Koa();
const cors = require('koa2-cors');
const path = require('path');
const static = require('koa-static');
const views = require('koa-views')
const onerror = require('Koa-onerror');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
// 导入controller middleware:
const controller = require('./controller');

// error handler
onerror(app);

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 允许跨域
app.use(cors());
// 解析静态资源
app.use(static(path.join(__dirname, '/front-end')))
// 解析页面
app.use(views(path.join(__dirname, '/front-end'), {
  extension: 'html'
}))

// 可以在这里添加
app.use(async (ctx, next) => {
  console.log('Check-----------');
  await next();
});

// 解析request的body
app.use(bodyParser({
  enableTypes:['json', 'form', 'text']
}))
app.use(controller());
// 根据ctx.status设置response响应头
app.use(router.allowedMethods());

// 连接数据库
mongoose.connect('mongodb://localhost/crawler',{
  useNewUrlParser: true,
});
const db = mongoose.connection;

// 在端口12083监听:
db.on('error', function () {
  console.log('连接数据库失败');
}).on('open', function () {
  app.listen('12083');
  console.log('数据库连接成功！app started at port 12083...');
  // error-handling
  app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
  });
});
