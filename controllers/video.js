const mongoose = require('mongoose');
const VideoScheme = require('../schemas/video');

mongoose.model('Video', VideoScheme);
const Video = mongoose.model('Video');

// 新增
const addVideo = async (ctx, next) => {
  const title = ctx.request.body.title;
  if (title) {
    const usedTitle = title && await Video.findByTitle(title);
    if (usedTitle) {
      console.log('该video对象已存在数据库~');
    } else {
      const _video = new Video(ctx.request.body);
      _video.save((err) => {
        if (err) {
          console.log('video对象存入数据库失败~');
        } else {
          console.log('video对象存入数据库成功！');
        }
      });
    }
  }
};

// 拉取视频列表
const list = async (ctx, next) => {
  const sort = ctx.request.query.sort;
  if (sort) {
    Video.findAllBySort(sort, (err, videos) => {
      if (err) {
        ctx.body = {
          err: 1,
          desc: '服务器繁忙'
        };
      } else {
        ctx.body = {
          err: 0,
          desc: '获取成功，共有' + videos.length + '条数据',
          data: videos
        };
      }
    });
  }
};

module.exports = {
  'GET /video/list': list,
  'POST /video/add': addVideo
};