const Router = require('koa-router');
const users = require('./user');

const router = new Router({
  prefix: '/learn',
});

router.use(users.routes());

module.exports = router;
