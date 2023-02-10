// 处理错误信息的逻辑

const {
  NAME_OR_PASSWORD_IS_REQUIRED,
  USER_ALREADY_EXISTS,
  USER_DOES_NOT_EXISTS,
  PASSWORD_IS_INCORRECT,
  UN_AUTHORIZATION,
  UN_PERMISSION,
} = require('../constants/err.types.js');

const errHandler = (error, ctx) => {
  let status, message;
  switch (error.message) {
    // 不同的 case ，status 和 message 是不一样的
    case NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400; // Bad Request
      message = '用户名或者密码不能为空~';
      break;
    case USER_ALREADY_EXISTS:
      status = 409; // Conflict
      message = '用户名已经存在~';
      break;
    case USER_DOES_NOT_EXISTS:
      status = 400; // Bad Request
      message = '用户名不存在~';
      break;
    case PASSWORD_IS_INCORRECT:
      status = 400; // Bad Request
      message = '用户名是不正确的~';
      break;
    case UN_AUTHORIZATION:
      status = 401; // Bad Request
      message = '无效的token~';
      break;
    case UN_PERMISSION:
      status = 401; // Bad Request
      message = '用户不具备该权限~';
      break;
    default:
      status = 404;
      message = 'NOT FOUND~';
      break;
  }

  ctx.status = status;
  ctx.body = message;
};

module.exports = { errHandler };
