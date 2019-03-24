const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
  title: String,
  img: String,
  url: String,
  sort: String,
  createTime: {
    type: Date,
    default: Date.now(),
  },
});


videoSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createTime = Date.now();
  } else {
    this.updateTime = Date.now();
  }
  next();
});

videoSchema.statics = {
  findByTitle: function (title, cb) {
    return this
      .findOne({ title: title })
      .exec(cb)
  },
  findAllBySort: function (sort, cb) {
    return this
      .find({ sort: sort }).sort({ 'createTime': -1 })
      .exec(cb)
  },
}
module.exports = videoSchema;