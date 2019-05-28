

// ui测试
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 0 });
  const page = await browser.newPage();
  await page.emulate(iPhone); // 让页面模拟成iphone6
  await page.goto('https://m.v.qq.com/play.html?cid=rjvr8psrvic4567&vid=')
  await page.screenshot({ path: 'test/image/1.png' })
  // 点击登录
  await page.click('.btn_user_text')
  await page.waitFor(1000)
  await page.screenshot({ path: 'test/image/2.png' })
  // 点击qq登录
  await page.waitFor(1000)
  await page.click('.btn_qq')
  await page.waitFor(1000)
  await page.screenshot({ path: 'test/image/3.png' })
  // 输入账号密码
  await page.type('#u', '******') // 账号
  await page.type('#p', '******') // 密码
  await page.screenshot({ path: 'test/image/4.png' })
  await page.waitFor(1000)
  // 点击登录
  await page.click('#go')
  await page.waitFor(1000)
  await page.screenshot({ path: 'test/image/5.png' })
  await page.waitFor(1000)

  await browser.close();
})()