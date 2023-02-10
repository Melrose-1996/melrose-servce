const jwt = require('jsonwebtoken');

// 负责 login 相关的中间件
const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  USER_DOES_NOT_EXISTS,
  PASSWORD_IS_INCORRECT,
  UN_AUTHORIZATION,
  UN_PERMISSION,
} = require('../constants/err.types.js');
const service = require('../service/user.service');

// 对应权限的服务端
const authService = require('../service/auth.service');

const { md5password } = require('../utils/password-handle');

const { PRIVATE_KEY } = require('../app/config');

const verifyLogin = async (ctx, next) => {
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

  // 3. 判断用户是否存在（用户不存在）
  // 返回过来本身是一个数组
  const result = await service.getUserByName(username);
  const user = result[0];

  if (!user) {
    const error = new Error(USER_DOES_NOT_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }

  // 4. 判断密码是否和数据库中的密码是一致的（加密）
  if (md5password(password) !== user.password) {
    const error = new Error(PASSWORD_IS_INCORRECT);
    return ctx.app.emit('error', error, ctx);
  }

  ctx.user = user;

  await next();
};

const verifyAuth = async (ctx, next) => {
  console.info('验证授权的 middleware~');

  // 1. 获取 token
  const authorization = ctx.headers.authorization;

  // 可能会存在取不到 authorization 的情况
  if (!authorization) {
    const error = new Error(UN_AUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  const token = authorization.replace('Bearer ', '');

  // 2. 验证 token(id/name/iat/exp)
  try {
    const result = jwt.verify(token, PRIVATE_KEY, {
      algorithms: ['RS256'],
    });
    ctx.user = result;

    await next();
  } catch (err) {
    const error = new Error(UN_AUTHORIZATION);

    // 注意第一个参数要写事件名称
    return ctx.app.emit('error', error, ctx);
  }
};

const verifyPermission = async (ctx, next) => {
  console.info('验证是否拥有该权限的 middleware~');

  // 1. 获取参数
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace('Id', '');
  const resourceId = ctx.params[resourceKey];
  const { id } = ctx.user;

  // 2. 查询是否具备权限
  try {
    // 创建一个新的专门用来验证是否有操作权限的服务
    const isPermission = await authService.checkResource(
      tableName,
      resourceId,
      id
    );

    if (isPermission) throw new Error();
    await next();
  } catch (err) {
    const error = new Error(UN_PERMISSION);
    return ctx.app.emit('error', error, ctx);
  }
};

// const verifyPermission = tableName => {
//   return async (ctx, next) => {
//     console.log('验证权限的middleware~');

//     // 1.获取参数
//     const { momentId } = ctx.params;
//     const { id } = ctx.user;

//     // 2.查询是否具备权限
//     try {
//       const isPermission = await authService.checkResource(
//         tableName,
//         momentId,
//         id
//       );
//       if (!isPermission) throw new Error();
//       await next();
//     } catch (err) {
//       const error = new Error(errorTypes.UNPERMISSION);
//       return ctx.app.emit('error', error, ctx);
//     }
//   };
// };

module.exports = { verifyLogin, verifyAuth, verifyPermission };
