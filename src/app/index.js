const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const { errHandler } = require('./error-handle');
const useRouters = require('../router');

const app = new Koa();

app.useRouters = useRouters;

// 中间件的执行是存在顺序的，需要把 bodyParser 放在最前面
app.use(bodyParser());

// useRouters(app);
app.useRouters();

// 错误统计
app.on('error', errHandler);

module.exports = app;
