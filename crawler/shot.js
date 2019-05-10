
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 0 }); // 模拟启动一个浏览器
  const page = await browser.newPage(); // 打开一个新页面
  await page.goto('http://example.com'); // 打开某个网址
  await page.screenshot({ path: 'test/image/example.png' }); // 执行截图
  // await page.pdf({ path: 'test/pdf/example.pdf', format: 'A4' }); // 创建一个pdf,headless需为true
  await browser.close(); // 关闭浏览器
})()

