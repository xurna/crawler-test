import mongoose from 'mongoose';
import SortScheme from '../schemas/sort';

mongoose.model('Sort', SortScheme);
const Sort = mongoose.model('Sort');

// 新增
const addSort = async (ctx, next) => {
  const sort = ctx.request.body.sort;
  if (sort) {
    const usedSort = sort && await Sort.findBySort(sort);
    if (usedSort) {
      console.log('该分类已存在数据库~');
    } else {
      const _sort = new Sort(ctx.request.body);
      _sort.save((err) => {
        if (err) {
          console.log('分类对象存入数据库失败~');
        } else {
          console.log('分类对象存入数据库成功！');
        }
      });
    }
  }
};

// 拉取列表
const list = async (ctx, next) => {
    Sort.findAll((err, sorts) => {
      if (err) {
        ctx.body = {
          err: 1,
          desc: '服务器繁忙'
        };
      } else {
        ctx.body = {
          err: 0,
          desc: '获取成功，共有' + sorts.length + '条数据',
          data: sorts
        };
      }
    });
};

module.exports = {
  'GET /sort/list': list,
  'POST /sort/add': addSort
};