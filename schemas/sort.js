const mongoose = require('mongoose');
const sortSchema = new mongoose.Schema({
  sort: String,
  url: String,
  createTime: {
    type: Date,
    default: Date.now(),
  },
});

sortSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createTime = Date.now();
  } else {
    this.updateTime = Date.now();
  }
  next();
});

sortSchema.statics = {
  findBySort: function (sort, cb) {
    return this
      .findOne({ sort: sort })
      .exec(cb)
  },
  findAll: function (cb) {
    return this
      .find({}).sort({ 'createTime': -1 })
      .exec(cb)
  },
}

module.exports = sortSchema;