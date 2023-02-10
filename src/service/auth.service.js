// 验证是否有对应权限的数据库处理
const connection = require('../app/database');

class AuthService {
  async checkResource(tableName, id, userId) {
    try {
      const statement = `SELECT * FROM ${tableName} WHERE id = ? And user_id = ?;`;

      const [result] = await connection.execute(statement, [
        id,
        userId,
      ]);

      return result.length === 0;
    } catch (error) {
      console.info(error);
    }
  }
}

module.exports = new AuthService();
