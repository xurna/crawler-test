

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
  await page.goto('https://www.bilibili.com/');

  let list = await page.evaluate(() => {  // 爬取内容
    const title = document.querySelectorAll('.ri-title')
    const elements = Array.from(title);
    let titles = elements.map(element => {
      return element.innerHTML
    })
    return titles
  });
  console.log(list)

  await page.waitFor(1000) // 等待时长
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  await browser.close();
})()




