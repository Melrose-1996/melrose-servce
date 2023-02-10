const service = require('../service/label.service');

const verifyLabelExists = async (ctx, next) => {
  console.info('验证标签是否存在的接口～');
  // 1. 取出要添加的所有的标签
  const { labels } = ctx.request.body;

  // 2. 判断每一个标签在 label 表中是否存在
  const newLabels = [];
  for (const name of labels) {
    const labelResult = await service.getLabelByName(name);
    const label = { name };

    if (!labelResult) {
      // 创建标签数据
      const result = await service.create(name);
      label.id = result.insertId;
    } else {
      label.id = labelResult.id;
    }
    newLabels.push(label);
  }

  ctx.labels = newLabels;

  await next();
};

module.exports = { verifyLabelExists };
