const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto('http://www.baidu.com')
  await page.type('#kw', 'puppeteer')
  await page.click('#su')
  await page.waitFor(2000)
  await page.screenshot({ path: 'test/image/search.png', fullPage: true })
  // await browser.close()
})()

