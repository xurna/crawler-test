
// const Crawler = require("crawler");

// var c = new Crawler({
//   maxConnections : 10,
//   // This will be called for each crawled page
//   callback : function (error, res, done) {
//       if(error){
//           console.log('error',error);
//       }else{
//           var $ = res.$;
//           // $ is Cheerio by default
//           //a lean implementation of core jQuery designed specifically for the server
//           console.log($("title").text());
//           console.log($("#header-mobile-app").text());
//       }
//       done();
//   }
// });

// // Queue URLs with custom callbacks & parameters
// c.queue([{
//   uri: 'https://www.bilibili.com/v/dance/',
//   jQuery: true,

//   // The global callback won't be called
//   callback: function (error, res, done) {
//       if(error){
//           console.log('error',error);
//       }else{
//         var $ = res.$;
//           // console.log('Grabbed', res.body, 'bytes');
//           console.log($("title").text());
//           $(".t").each(function(){
//             console.log($(this).text())
//           })
//           // console.log($(".spread-module").find('p'));
//       }
//       done();
//   }
// }]);



// const HCCrawler = require('headless-chrome-crawler');

// (async () => {
//   const crawler = await HCCrawler.launch({
//     // Function to be evaluated in browsers
//     evaluatePage: (() => ({
//       title: $('spread-module'),
//     })),
//     // Function to be called with evaluated results from browsers
//     onSuccess: (result => {
//       console.log('result-------------');
//       console.log(result.result);
//       // result.result.title.prevObject[0].each(function () {
//       //   console.log($(this).text())
//       // })
//     }),
//   });
//   // Queue a request
//   await crawler.queue([{url:'https://www.bilibili.com/v/dance/'},{waitFor:{
//     selectorOrFunctionOrTimeout:".spread-module",
//   }}]);
//   await crawler.onIdle(); // Resolved when no queue is left
//   await crawler.close(); // Close the crawler
// })();

const puppeteer = require('puppeteer');
const $ = require('cheerio');

const workPath = './contents';
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
  //filter to block images
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
    let sel = $('#primary_menu .nav-menu li > a')
    let elements = Array.from(sel);
    let sortList = elements.map(element => {
      return { sort: $(element).find('.nav-name').text(), href: element.href };
    })
    return sortList
  });

  sort = sort.filter((item, index, arr) => {
    return item.sort !== '';
  })

  console.log('sort:', sort.length);

  process();
  async function process() {
    if (countUrl < sort.length) {
      url = sort[countUrl].href;
      countUrl++;
    } else {
      browser.close();
      return;
    }
    console.log('processing url: ' + url);
    try {
      const tab = await browser.newPage();
      // await tab.setUserAgent(userAgent);
      await tab.setViewport({ width: 1024, height: 800 });
      // await tab.setRequestInterception(true);
      // //filter to block images
      // tab.on('request', request => {
      //   if (request.resourceType() === 'image')
      //     request.abort();
      //   else
      //     request.continue();
      // });
      await tab.goto(url);
      //execute tap request
      

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
          return { title: $(element).children('p:last-child').text(), img: $(element).find('img').attr('src'), href: element.href };
        })
        return detailList
      });

      const contents = url+ '\n'+ JSON.stringify(sortDetailList);
      // console.log(contents);
      console.log(countUrl,'sort---------:', sortDetailList.length);
      const fs = require("fs");
      fs.writeFileSync(workPath + '/' + countUrl + '.txt', contents);
      // console.log(title + " has been downloaded to local.");
      await tab.close();

    } catch (err) {
      // console.log('url: ' + tab.url() + ' \n' + err.toString());
    } finally {
      process();
    }

  }

  // await browser.close();
})();


//emulate iphone
// const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1';
// const workPath = './contents';
// const fs = require("fs");
// if (!fs.existsSync(workPath)) {
//         fs.mkdirSync(workPath)
// }
// //base url
// // const rootUrl = 'https://blog.csdn.net/';
// const rootUrl = 'https://www.bilibili.com/v/dance/';
// //max wait milliseconds
// const maxWait = 100;
// //max loop scroll times
// const makLoop = 10;
// (async () => {
//     let url;
//     let countUrl=0;
//     const browser = await puppeteer.launch({headless: true});//set headless: true will hide chromium UI
//     const page = await browser.newPage();
//     await page.setUserAgent(userAgent);
//     await page.setViewport({width:414, height:736});
//     // 启用请求拦截器,启用请求拦截器会禁用页面缓存。
//     await page.setRequestInterception(true);
//     //filter to block images
//     page.on('request', request => {
//       // 如果请求中是image类型，则摒弃
//     if (request.resourceType() === 'image')
//       request.abort();
//     else
//       request.continue();
//     });
//     await page.goto(rootUrl);

//     // 如果是下拉加载的情况下使用
//     // for(let i= 0; i<makLoop;i++){
//     //     try{
//     //         await page.evaluate(()=>window.scrollTo(0, document.body.scrollHeight));
//     //         // 等待时间
//     //         await page.waitForNavigation({timeout:maxWait,waitUntil: ['networkidle0']});
//     //     }catch(err){
//     //         console.log('scroll to bottom and then wait '+maxWait+'ms.');
//     //     }
//     // }
//     await page.screenshot({path: workPath+'/screenshot.png',fullPage: true, quality :100, type :'jpeg'});
//     //#feedlist_id li[data-type="blog"] a
//     // const sel = '#feedlist_id li[data-type="blog"] h2 a';
//     const sel = '.spread-module a'
//     const hrefs = await page.evaluate((sel) => {
//         let elements = Array.from(document.querySelectorAll(sel));
//         let links = elements.map(element => {
//             return element.href
//         })
//         return links;
//     }, sel);
//     console.log('total links: '+hrefs.length);
//     // process();
//   async function process(){
//     if(countUrl<hrefs.length){
//         url = hrefs[countUrl];
//         countUrl++;
//     }else{
//         browser.close();
//         return;
//     }
//     console.log('processing url: '+url);
//     try{
//         const tab = await browser.newPage();
//         await tab.setUserAgent(userAgent);
//         await tab.setViewport({width:414, height:736});
//         await tab.setRequestInterception(true);
//         //filter to block images
//         tab.on('request', request => {
//         if (request.resourceType() === 'image')
//           request.abort();
//         else
//           request.continue();
//         });
//         await tab.goto(url);
//         //execute tap request
//         try{
//             await tab.tap('.read_more_btn');
//         }catch(err){
//             console.log('there\'s none read more button. No need to TAP');
//         }
//         let title = await tab.evaluate(() => document.querySelector('#article .article_title').innerText);
//         let contents = await tab.evaluate(() => document.querySelector('#article .article_content').innerText);
//         contents = 'TITLE: '+title+'\nURL: '+url+'\nCONTENTS: \n'+contents;
//         const fs = require("fs");
//         fs.writeFileSync(workPath+'/'+tab.url().substring(tab.url().lastIndexOf('/'),tab.url().length)+'.txt',contents);
//         console.log(title + " has been downloaded to local.");
//         await tab.close();
//     }catch(err){
//         console.log('url: '+tab.url()+' \n'+err.toString());
//     }finally{
//         process();
//     }

//   }
// })();



const fn_hello = async (ctx, next) => {
  const name = ctx.params.name;
  ctx.response.body = { name: 'hello' };
};

module.exports = {
  'GET /hello/:name': fn_hello
};