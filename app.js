const Koa = require('koa');
const cors = require('koa2-cors');
const path = require('path'); 
const static = require('koa-static'); 
const views = require('koa-views')
const onerror = require('Koa-onerror');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
// 导入controller middleware:
const controller = require('./controller');
const app = new Koa();

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
app.use(static(path.join( __dirname,  '/front-end'))) 
// 解析页面
app.use(views(path.join( __dirname,  '/front-end'), {
  extension: 'html'
}))

// 可以在这里添加
app.use(async (ctx, next) => {
  console.log('Check-----------');
  await next();
});

// 解析request的body
app.use(bodyParser());
app.use(controller());
// 根据ctx.status设置response响应头
app.use(router.allowedMethods());

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
