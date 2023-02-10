const mysql = require('mysql2');

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = require('./config');

const connections = mysql.createPool({
  host: MYSQL_HOST,
  prot: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
});

connections.getConnection((err, conn) => {
  console.info(err);
  conn.connect(err => {
    if (err) console.info('连接失败:', err);
    else console.log('数据库连接成功~');
  });
});

// 在导出前就将它 promise 化
module.exports = connections.promise();
