const fileService = require('../service/file.service');
const userService = require('../service/user.service');
const { APP_HOST, APP_PORT } = require('../app/config');

class FileController {
  async saveAvatarInfo(ctx, next) {
    // 1. 获取图片相关的信息
    const { mimetype, serviceName, size } = ctx.request.file;
    const { id } = ctx.user;

    // 2. 将图像信息数据保存到数据库中
    await fileService.createAvatar({
      mimetype,
      filename: serviceName,
      size,
      id,
    });

    // 3. 将图片地址保存到 users 表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    await userService.updateAvatarUrlById(avatarUrl, id);

    // 返回结果
    ctx.body = '上传头像成功~';
  }

  async savePictureInfo(ctx, next) {
    console.info('动态图片上传～');

    // 1. 获取图片相关的信息
    const files = ctx.request.files;
    const { id } = ctx.user;
    const { momentId } = ctx.query;

    for (const file of files) {
      const { mimetype, serviceName, size } = file;
      // 2. 将文件信息数据保存到数据库中
      await fileService.createFile(
        mimetype,
        serviceName,
        size,
        id,
        momentId
      );
    }

    // 返回结果
    ctx.body = '动态配图上传成功~';
  }
}

module.exports = new FileController();
