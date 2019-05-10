const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto('http://www.baidu.com')
  await page.type('#kw', 'puppeteer') // 键盘输入关键字
  await page.waitFor(1000)
  await page.click('#su') // 模拟用户点击搜索提交表单
  await page.waitFor(2000)
  await page.screenshot({ path: 'test/image/search.png', fullPage: true }) // 截全屏
  await browser.close()
})()

