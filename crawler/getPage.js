


const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 0 });
  const page = await browser.newPage();
  await page.setViewport({
    width: 375,
    height: 600,
    isMobile: true,
    hasTouch: true
  })
  await page.goto('https://toutiao.qiushibaike.com/yuedu/taskcenter');

  let list = await page.evaluate(() => {
    const name = document.querySelectorAll('.header-wrapper .name')
    const elements = Array.from(name);
    let names = elements.map(element => {
      return element.innerHTML
    })
    return names
  });

  console.log(list)

  try {
    await page.waitFor(1000)
    await page.click('.close-btn');
  } catch (err) {
    console.log('there\'s no button. No need to TAP');
  }

  // await page.close();
  // await browser.close();

})()




