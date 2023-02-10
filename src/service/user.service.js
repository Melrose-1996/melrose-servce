// 负责 users 相关的数据库逻辑
const connection = require('../app/database');

class UserService {
  // 把用户相关的信息传递过来
  async create(user) {
    const { username, password } = user;

    // 将 user 存储到数据库中
    const statement = `INSERT INTO users (name, password) VALUES (?, ?);`;

    const result = await connection.execute(statement, [
      username,
      password,
    ]);

    return result[0];
  }

  async getUserByName(name) {
    const statement = `SELECT * FROM users WHERE name = ?;`;
    const [result] = await connection.execute(statement, [name]);

    return result;
  }

  async updateAvatarUrlById(avatarUrl, userId) {
    const statement = `UPDATE users SET avatar_url = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [
      avatarUrl,
      userId,
    ]);

    return result;
  }
}

module.exports = new UserService();
