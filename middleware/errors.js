/**
 * Error handler middleware
 *
 * @param   {Object}    ctx       Koa context
 * @param   {function}  next      Koa next function
 * @returns {void}
 */
module.exports = async (ctx, next) => {
  try {
    await next();
    ctx.body = {
      code: ctx.status,
      data: ctx.body,
      message: 'success',
    };
  } catch (err) {
    if (err?.kind === 'ObjectId') {
      err.status = 404;
    } else {
      ctx.status = 200;
      ctx.body = {
        code: err.status || 500,
        message: err.message,
      };
    }
  }
};
