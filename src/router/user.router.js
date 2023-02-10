// 负责 users 相关的注册接口
const Router = require('koa-router');

const {
  create,
  avatarInfo,
} = require('../controller/user.controller');
const {
  verifyUser,
  handlePassword,
} = require('../middleware/user.middleware');

const userRouter = new Router({ prefix: '/users' });

// 在创建之前。需要先去判断信息是否完整、格式是否正确、信息是否重复
// 处理这块的逻辑，应该放入中间件（专门处理逻辑）的文件夹中

// password 加密的事件通过额外的中间件来进行处理
userRouter.post('/', verifyUser, handlePassword, create);

userRouter.get('/:userId/avatar', avatarInfo);

module.exports = userRouter;
