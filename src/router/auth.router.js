// 负责 login 相关的注册接口

const Router = require('koa-router');

const authRouter = new Router({ prefix: '/login' });

const {
  login,
  success,
} = require('../controller/auth.controller.js');
const {
  verifyLogin,
  verifyAuth,
} = require('../middleware/auth.middleware');

authRouter.post('/', verifyLogin, login);
// 测试用户是否有访问的权限(是否已经登录)
authRouter.get('/test', verifyAuth, success);

module.exports = authRouter;
