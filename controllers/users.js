const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {secret} = require('../config');
const {findByPhone, register, update} = require('../services/users');

const saltRounds = 12;

const users = {
  async login(ctx) {
    try {
      const {phone, password} = ctx.request.body;
      const result = await findByPhone(phone);
      if (!result) ctx.throw(401, '用户未注册');
      const match = await bcrypt.compare(password, result.password);
      if (!match) ctx.throw(401, '密码错误');
      const token = jwt.sign({phone}, secret, {expiresIn: '240h'});
      ctx.body = token;
    } catch (error) {
      ctx.throw(error.status || 400, error.message);
    }
  },

  async register(ctx) {
    try {
      const {name, password, phone} = ctx.request.body;
      const result = await findByPhone(phone);
      if (result) ctx.throw(400, '该手机号已注册');
      await register({
        name,
        password: await bcrypt.hash(password, saltRounds),
        phone,
      });
      ctx.status = 201;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  },

  async update(ctx) {
    try {
      const {name, password, phone} = ctx.request.body;
      const result = await findByPhone(phone);
      if (!result || result.name !== name)
        ctx.throw(400, '该手机号未与该账号绑定');
      await update(phone, await bcrypt.hash(password, saltRounds));
      ctx.status = 200;
    } catch (error) {
      ctx.throw(400, error.message);
    }
  },
};

module.exports = users;
