const Router = require('koa-router');

const {login, register, update} = require('../../controllers/users.js');

const router = new Router({
  prefix: '/users',
});

router.post('/login', async (ctx) => {
  await login(ctx);
});

router.post('/register', async (ctx) => {
  await register(ctx);
});

router.patch('/update', async (ctx) => {
  await update(ctx);
});

module.exports = router;
