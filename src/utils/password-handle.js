// 加密密码的形式
// node 中自带的库
const crypto = require('crypto');

const md5password = password => {
  // 参数一：采用何种算法
  const md5 = crypto.createHash('md5');
  // 默认返回的是一个对象，如果想返回的是一个字符串的话，需要调用 digest
  // 默认转化成的是 二进制（buffer），设置成 16进制
  const result = md5.update(password).digest('hex');
  return result;
};

module.exports = { md5password };
