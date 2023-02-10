const path = require('path');
const fs = require('fs');

const Multer = require('@koa/multer');
const Jimp = require('jimp');

const {
  AVATAR_PATH,
  PICTURE_PATH,
} = require('../constants/file-path');

// const storage = Multer.diskStorage({
//   destination: (req, file, cb) => cb(null, AVATAR_PATH),
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const pictureStorage = Multer.diskStorage({
//   destination: (req, file, cb) => cb(null, PICTURE_PATH),
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const avatarUpload = Multer({
//   storage,
// });

// const pictureUpload = Multer({
//   pictureStorage,
// });

const avatarUpload = Multer({
  dest: AVATAR_PATH,
});

const pictureUpload = Multer({
  dest: PICTURE_PATH,
});

const avatarHandler = avatarUpload.single('avatar');
const pictureHandler = pictureUpload.array('picture', 9);

const singleUpload = async (ctx, next) => {
  let file = ctx.request.file;

  fs.renameSync(
    AVATAR_PATH + file.filename,
    AVATAR_PATH + Date.now() + file.originalname
  );
  file.serviceName = Date.now() + file.originalname;
  await next();
};

const arrayUpload = async (ctx, next) => {
  const files = ctx.request.files;

  for (const file of files) {
    fs.renameSync(
      PICTURE_PATH + file.filename,
      PICTURE_PATH + Date.now() + file.originalname
    );
    file.serviceName = Date.now() + file.originalname;
  }
  await next();
};

const pictureResize = async (ctx, next) => {
  // 1. 获取所有的图像信息
  let files = ctx.request.files;

  console.info(files);

  // 2. 对图像进行处理（sharp(path).resize => 库本身偏大）
  // jimp 相对来说小一点
  for (const file of files) {
    // 通过 read 去读取某一个文件，创建 image 这个对象
    // 处理图片比较耗时，就在 then 里面自行处理
    const destPath = path.join(file.destination, file.serviceName);
    Jimp.read(destPath).then(image => {
      // 参数1: 宽度；参数2: 高度
      const name = file.serviceName.split('.');
      const getPath = type =>
        path.join(file.destination, `${name[0]}-${type}.${name[1]}`);
      console.info(getPath('large'));
      image.resize(1280, Jimp.AUTO).write(getPath('large'));
      image.resize(640, Jimp.AUTO).write(getPath('middle'));
      image.resize(320, Jimp.AUTO).write(getPath('small'));
    });
  }

  await next();
};

module.exports = {
  avatarHandler,
  pictureHandler,
  singleUpload,
  arrayUpload,
  pictureResize,
};
