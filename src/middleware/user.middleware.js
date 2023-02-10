// 负责 users 相关的中间件
// 中间件是一个个函数

const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  USER_ALREADY_EXISTS,
} = require('../constants/err.types.js');
const service = require('../service/user.service');
const { md5password } = require('../utils/password-handle');

const verifyUser = async (ctx, next) => {
  // 1. 获取用户名和密码
  const { username, password } = ctx.request.body;

  // 2. 判断用户名或者密码不能为空
  if (!username.trim() || !password.trim()) {
    // 开发的过程中可能会存在各种各样的错误，一般就可以建立一个错误的常量
    // 常量在对应的文件夹中进行存储

    const error = new Error(NAME_OR_PASSWORD_IS_REQUIRED);

    // 注意第一个参数要写事件名称
    return ctx.app.emit('error', error, ctx);
  }

  // 3. 判断这里注册的用户名是没有被注册过的
  const result = await service.getUserByName(username);
  if (result.length) {
    const error = new Error(USER_ALREADY_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }

  // 必须要调用 next，后续的中间件才会执行
  await next();
};

const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body;

  ctx.request.body.password = md5password(password);
  await next();
};

module.exports = {
  verifyUser,
  handlePassword,
};
