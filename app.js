const Koa = require('koa');
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
// 导入controller middleware:
const controller = require('./controller');
const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

// ctx.url相当于ctx.request.url，ctx.type相当于ctx.response.type

// 可以在这里添加
app.use(async (context, next)=>{
  console.log('Check-----------');
  // 检查操作
  await next();
});

// 解析request的body
app.use(bodyParser());
// add controllers:
app.use(controller());

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');
