const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const cors = require('koa2-cors');
const helmet = require('koa-helmet');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaJwt = require('koa-jwt');
const mongoose = require('mongoose');
const {requestLogger, logger} = require('./middleware/logger'); // 日志
const {responseTime, errors} = require('./middleware');
const publicRouter = require('./router/public');
const {uri, dbName, secret} = require('./config');

const app = new Koa();

mongoose.connect(`${uri}${dbName}`, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  logger.error(err);
});
db.once('connected', () => {
  logger.info('Mongo connected');
  app.emit('ready');
});
db.on('reconnected', () => {
  logger.info('Mongo re-connected');
});
db.on('disconnected', () => {
  logger.info('Mongo disconnected');
});

// disable console.errors for pino 默认情况下，将所有错误输出到 stderr，除非 app.silent 为 true
app.silent = true;

// Error handler
app.use(errors);

// jwt
app.use(
  koaJwt({secret}).unless({
    path: [
      /^\/learn\/users\/login/,
      /^\/learn\/users\/register/,
      /^\/learn\/users\/update/,
      /^\/learn\/public/,
    ],
  }),
);

// 协商缓存
app.use(conditional());
// 使用ETag代替Last-Modified来进行缓存
app.use(etag());
// 解析实体部分
app.use(bodyParser());

// HTTP header security 增加安全性
app.use(helmet());

// Enable CORS for all routes 跨域
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Accept'],
    exposeHeaders: ['spacex-api-cache', 'spacex-api-response-time'],
  }),
);

// Set header with API response time
app.use(responseTime);

// Request logging
app.use(requestLogger);

// routes
app.use(publicRouter.routes());

module.exports = app;
