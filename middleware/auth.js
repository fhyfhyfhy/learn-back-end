const mongoose = require('mongoose');

const db = mongoose.connection.useDb('learn', {useCache: true});

/**
 * Authentication middleware
 */
module.exports = async (ctx, next) => {
  const key = ctx.request.headers.token;
  if (key) {
    const user = await db.collection('users').findOne({key});
    if (user?.key === key) {
      // ctx.state.roles = user.roles;
      await next();
      return;
    }
  }
  ctx.status = 401;
  ctx.body = 'https://youtu.be/RfiQYRn7fBg';
};
