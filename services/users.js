const User = require('../models/users');

const users = {
  /**
   * 通过电话号查找
   * @param {String} phone 电话号
   */
  findByPhone(phone) {
    return User.findOne({phone});
  },

  /**
   * 保存user
   * @param {Object} user 新注册的user
   */
  register(user) {
    const userObj = new User(user);
    return userObj.save();
  },

  /**
   * 更新密码
   * @param {String} phone 电话号
   * @param {String} password 密码
   */
  update(phone, password) {
    return User.findOneAndUpdate({phone}, {password}, {runValidators: true});
  },
};

module.exports = users;
