
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true, slowMo: 0 });
  const page = await browser.newPage();
  await page.goto('http://example.com');
  await page.screenshot({ path: 'test/image/example.png' });
  // await page.pdf({ path: 'test/pdf/example.pdf', format: 'A4' }); // 创建一个pdf,headless需为true
  await browser.close();
})()

