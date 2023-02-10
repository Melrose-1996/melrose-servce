const Router = require('koa-router');

const { verifyAuth } = require('../middleware/auth.middleware');
const {
  avatarHandler,
  pictureHandler,
  singleUpload,
  arrayUpload,
  pictureResize,
} = require('../middleware/file.middleware');

const {
  saveAvatarInfo,
  savePictureInfo,
} = require('../controller/file.controller.js');

const fileRouter = new Router({ prefix: '/upload' });

// 相对路径，相对的是 process.cwd

// uploads/avatar
// upload/picture
// fileRouter.post('/avatar', 中间件(保存图像), mimetype/filename/userId/size);
// fileRouter.post('/avatar', 中间件(保存图像), 控制器(保存上面的图片信息));

fileRouter.post(
  '/avatar',
  verifyAuth,
  avatarHandler,
  singleUpload,
  saveAvatarInfo
);

fileRouter.post(
  '/picture',
  verifyAuth,
  pictureHandler,
  arrayUpload,
  pictureResize,
  savePictureInfo
);
module.exports = fileRouter;
