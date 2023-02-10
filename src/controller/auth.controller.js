// 负责 login 相关的接口逻辑
const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../app/config');

class AuthController {
  async login(ctx, next) {
    const { id, name } = ctx.user;
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: 'RS256',
    });
    // const { username } = ctx.request.body;                                                  //..,,l;bv
    // ctx.body = `登录成功，欢迎${username}回来~`;
    ctx.body = { id, name, token };
  }

  async success(ctx, next) {
    ctx.body = '授权成功~';
  }
}

module.exports = new AuthController();
