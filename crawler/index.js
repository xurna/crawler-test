// const HCCrawler = require('headless-chrome-crawler');
const puppeteer = require('puppeteer');
const path = require('path');
const eachSeries = require('async/eachSeries');
const $ = require('cheerio');

const workPath = '../contents';
const fs = require("fs");
if (!fs.existsSync(workPath)) {
  fs.mkdirSync(workPath)
}
const rootUrl = 'https://www.bilibili.com/';
//max wait milliseconds
const maxWait = 300;
//max loop scroll times
const makLoop = 5;
(async () => {
  let url;
  let countUrl = 0;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(true);
  // 启用请求拦截器,启用请求拦截器会禁用页面缓存。
  await page.setRequestInterception(true);
  //过滤图片，加速渲染页面
  page.on('request', request => {
    // 如果请求中是image类型，则摒弃
    if (request.resourceType() === 'image')
      request.abort();
    else
      request.continue();
  });
  await page.goto(rootUrl);

  // 或者视频分类数组 [{sort:xxx,href:xxx},...]
  let sort = await page.evaluate(() => {
    const sel = $('#primary_menu .nav-menu li > a')
    const elements = Array.from(sel);
    const sortList = elements.map(element => {
      return { sort: $(element).find('.nav-name').text(), href: element.href };
    })
    return sortList
  });

  sort = sort.filter((item, index, arr) => {
    return item.sort !== '';
  })
  // todo 更新数据库

  console.log('sort:', sort.length);

  // 同步执行
  eachSeries(sort, (item, callback) => {
    // 当前操作完成后使用callback执行下一个操作。
    process(item, () => { callback() })
  }, (err) => {
    // 全部执行完成后
    if (err) {
      console.log(err)
      browser.close();
    } else {
      console.log('success!');
      browser.close();
    }
  })

  async function process(item, cb) {
    url = item.href;
    countUrl++;
    console.log('processing url: ' + url);
    try {
      const tab = await browser.newPage();
      await tab.setViewport({ width: 1024, height: 800 });
      await tab.goto(url);

      // 页面进行下拉加载的情况下使用，已模拟用户浏览获取更多的数据
      for (let i = 0; i < makLoop; i++) {
        try {
          await tab.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          // 等待时间
          await tab.waitForNavigation({ timeout: maxWait, waitUntil: ['networkidle0'] });
        } catch (err) {
          // console.log('scroll to bottom and then wait ' + maxWait + 'ms.');
        }
      }

      // 点击刷新以获取更新的数据
      try {
        await tab.click('.read-push');
      } catch (err) {
        console.log('there\'s none refresh button. No need to TAP');
      }

      // 或者视频数组 [{title:xxx,img:xxx,href:xxx},...]
      const sortDetailList = await tab.evaluate(() => {
        const sel = $('.spread-module a')
        const elements = Array.from(sel);
        const detailList = elements.map(element => {
          return { title: $(element).find('.t').text(), img: $(element).find('img').attr('src'), href: element.href };
        })
        return detailList
      });

      // todo 更新数据库
      const contents = url + '\n' + JSON.stringify(sortDetailList);
      console.log(countUrl, 'sort---------:', sortDetailList.length);
      const fs = require("fs");
      fs.writeFileSync(workPath + '/' + countUrl + '.json', contents);
      await tab.close();
      
    } catch (err) {
      console.log('----------err----------', err)
    } finally {
    }
    // 执行下一个
    cb()

  }
})();
