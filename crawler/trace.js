// 性能分析
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(iPhone); // 让页面模拟成iphone6
  await page.tracing.start({ path: 'test/doc/trace.json' }); // 生成页面性能追踪的文件
  await page.goto('https://www.bilibili.com/');
  await page.tracing.stop();
  browser.close();
})();