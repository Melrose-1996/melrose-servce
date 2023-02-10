// 负责 users 相关的接口逻辑
const fs = require('fs');

const fileService = require('../service/file.service');
const { create: serverCreate } = require('../service/user.service');

const { AVATAR_PATH } = require('../constants/file-path');

class UserController {
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body;

    // 查询数据 —— 这部分的逻辑也会抽离出来，抽到 service 文件里面
    const result = await serverCreate(user);

    // 返回数据
    ctx.body = result;
    // ctx.body = '创建用户成功~';
  }

  async avatarInfo(ctx, next) {
    // 1. 获取用户的头像
    const { userId } = ctx.params;

    const avatarInfo = await fileService.getAvatarByUserId(userId);

    // 2. 提供图像信息
    // 告诉响应类型，取消下载功能
    ctx.response.set('content-type', avatarInfo.mimetype);
    ctx.body = fs.createReadStream(
      `${AVATAR_PATH}/${avatarInfo.filename}`
    );
  }
}

module.exports = new UserController();
