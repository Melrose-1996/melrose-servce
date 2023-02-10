const fs = require('fs');
const { PICTURE_PATH } = require('../constants/file-path.js');

const fileService = require('../service/file.service.js');
const momentService = require('../service/moment.service.js');

class MomentController {
  async create(ctx, next) {
    // 1. 获取数据(user_id, content)
    const userId = ctx.user.id;
    const content = ctx.request.body.content;

    // 2. 将数据插入到数据库
    const result = await momentService.create({ userId, content });

    console.info(result);

    ctx.body = result;
  }

  async detail(ctx, next) {
    // 1. 获取数据(momentId)
    const momentId = ctx.params.momentId;

    // 2. 根据 id 去查询这条数据
    const result = await momentService.getMomentById(momentId);

    ctx.body = result;
  }

  async list(ctx, next) {
    // 1. 获取数据(offset/size)
    const { offset, size } = ctx.query;

    // 2. 查询列表
    const result = await momentService.getMomentList(offset, size);

    ctx.body = result;
  }

  async update(ctx, next) {
    // 1. 获取参数
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;

    // 2. 修改内容
    const result = await momentService.update({ momentId, content });

    ctx.body = result;
  }

  async remove(ctx, next) {
    // 1. 获取 momentId
    const { momentId } = ctx.params;

    // 2. 修改内容
    const result = await momentService.remove(momentId);

    ctx.body = result;
  }

  async addLabels(ctx, next) {
    // 1. 获取标签和动态的 id
    const { labels } = ctx;
    const { momentId } = ctx.params;

    // 2. 添加所有的标签
    for (const label of labels) {
      // 2.1 判断标签是否已经和动态有关系
      const isExist = await momentService.hasLabel(
        momentId,
        label.id
      );

      if (!isExist) {
        await momentService.addLabel(momentId, label.id);
      }
    }

    ctx.body = '给动态添加标签成功~';
  }

  async fileInfo(ctx, next) {
    console.info('获取图片信息～');
    // 1. 获取到图片的名字
    const { filename } = ctx.params;

    // 2. 根据图片的名字去查找对应的图片信息
    const fileInfo = await fileService.getFileByFilename(filename);

    // 获取图片类型，对应加上图片的大小类型
    const { type } = ctx.query;

    let pictureName;

    const types = ['small', 'middle', 'large'];
    if (types.some(item => item === type)) {
      const filenameArray = filename.split('.');
      pictureName = `${filenameArray[0]}-${type}.${filenameArray[1]}`;
    }

    // 3. 返回对应的路径
    ctx.response.set('content-type', fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${pictureName}`);
  }
}

module.exports = new MomentController();
