// npm i --save puppeteer --ignore-scripts
const puppeteer = require('puppeteer');
(async () => {
  // const browser = await puppeteer.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless: false })
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setViewport({  // 设置viewport大小
    width: 1200,
    height: 600,
    isMobile: false,
    hasTouch: true
  })
  await page.goto('https://www.qimai.cn/')
  await page.waitFor(1000)
  await page.click('.platform') // 点击下拉框
  await page.waitFor(1000)
  await page.click('.platform-list > .ivu-dropdown-item:nth-child(2)') // 选择安卓
  await page.type('input[type=text][placeholder="应用名称或者包名"].ivu-input', 'com.coohua.xinwenzhuan') // 键盘输入关键字
  await page.keyboard.press('Enter'); // 回车
  await page.waitFor(1000)
  
  const name = await page.$eval('.appname', divs => divs.innerHTML);
  const market = await page.$eval('.auther .value', divs => divs.innerHTML);
  const url = await page.url();
  const arr  = url.split('/');
  const appid = arr[arr.length-1]
  console.log(name.trim())
  console.log(market)
  console.log('https://www.qimai.cn/andapp/samePubApp/appid/'+appid)

  // await browser.close()
})()

