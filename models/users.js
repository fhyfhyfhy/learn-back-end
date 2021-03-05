const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); // 分页中间件
const idPlugin = require('mongoose-id');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://s3.ax1x.com/2020/12/15/rKoPM9.png',
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  {autoCreate: true},
);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(idPlugin);

const User = mongoose.model('User', userSchema);

module.exports = User;
