const mongoose = require('mongoose');
const SortScheme = require('../schemas/sort');

mongoose.model('Sort', SortScheme);
const Sort = mongoose.model('Sort');
// 注意：koa不支持使用statics里面的方法，因为在回调函数里执行ctx.body无效，引发404
// 新增
const addSort = async (ctx, next) => {
  const sort = ctx.request.body.sort;
  if (sort) {
    const usedSort = await Sort.findOne({ sort: sort }).exec();
    if (usedSort) {
      ctx.body = {
        err: 1,
        desc: '数据已存在'
      };
      console.log(sort, '该分类已存在数据库~');
    } else {
      try {
        const _sort = new Sort(ctx.request.body);
        const saveResult = await _sort.save();
        if (saveResult) {
          ctx.body = {
            err: 0,
            desc: '操作成功！'
          };
          console.log('分类对象存入数据库成功！');
        } else {
          ctx.body = {
            err: 1,
            desc: '新增失败'
          };
          console.log('分类对象存入数据库失败~');
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
      desc: '缺少sort参数'
    };
  }
};

// 拉取列表
const list = async (ctx, next) => {
  const sorts = await Sort.find({}).sort({ 'createTime': 1 }).exec()
  if (sorts) {
    ctx.body = {
      err: 0,
      desc: '获取成功，共有' + sorts.length + '条数据',
      data: sorts
    };
  } else {
    ctx.body = {
      err: 1,
      desc: '服务器繁忙'
    };
  }
};

module.exports = {
  'POST /sort/add': addSort,
  'GET /sort/list': list,
};