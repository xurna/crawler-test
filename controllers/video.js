const mongoose = require('mongoose');
const VideoScheme = require('../schemas/video');

mongoose.model('Video', VideoScheme);
const Video = mongoose.model('Video');

// 新增
const addVideo = async (ctx, next) => {
  const title = ctx.request.body.title;
  if (title) {
    const usedTitle = await Video.findOne({ title: title }).exec();
    if (usedTitle) {
      ctx.body = {
        err: 0,
        desc: '数据已存在'
      };
      console.log('该video对象已存在数据库~');
    } else {
      try{
        const _video = new Video(ctx.request.body);
        const saveResult = await _video.save();
        if (saveResult) {
          ctx.body = {
            err: 0,
            desc: '操作成功！'
          };
          console.log('video对象存入数据库成功！');
        } else {
          ctx.body = {
            err: 1,
            desc: '新增失败'
          };
          console.log('video对象存入数据库失败~');
        }
      } catch (err) {
        if (err) console.log(err)
        ctx.body = {
          err: 1,
          data: err
        }
      }
    }
  } else {
    ctx.body = {
      err: 1,
      desc: '缺少title参数'
    };
  }
};

// 拉取视频列表
const list = async (ctx, next) => {
  const sort = ctx.request.query.sort;
  if (sort) {
    const videos = await Video.find({ sort: sort }).sort({ 'createTime': -1 }).exec()
    if (videos) {
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
  } else {
    ctx.body = {
      err: 1,
      desc: '缺少sort参数',
    };
  }
};

module.exports = {
  'POST /video/add': addVideo,
  'GET /video/list': list,
};