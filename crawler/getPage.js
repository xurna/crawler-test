

// 爬虫
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 0 });
  const page = await browser.newPage();
  await page.setViewport({  // 设置viewport大小
    width: 375,
    height: 600,
    isMobile: true,
    hasTouch: true
  })
  await page.goto('https://toutiao.qiushibaike.com/yuedu/taskcenter');

  let list = await page.evaluate(() => {  // 爬取内容
    const name = document.querySelectorAll('.header-wrapper .name')
    const elements = Array.from(name);
    let names = elements.map(element => {
      return element.innerHTML
    })
    return names
  });
  console.log(list)
  try {
    await page.waitFor(1000) // 等待时长
    await page.click('.close-btn'); // 模拟用户点击
  } catch (err) {
    console.log('there\'s no button. No need to click');
  }

  await page.waitFor(1000) // 等待时长
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await browser.close();
})()




