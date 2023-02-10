const connection = require('../app/database');

class CommentService {
  async create({ momentId, content, id }) {
    try {
      const statement = `INSERT INTO comment (content, moment_id, user_id) VALUES (?, ?, ?);`;
      const [result] = await connection.execute(statement, [
        content,
        momentId,
        id,
      ]);
      return result;
    } catch (error) {
      console.info(error);
    }
  }

  async reply({ momentId, content, id, commentId }) {
    try {
      const statement = `INSERT INTO comment (content, moment_id, user_id, comment_id) VALUES (?, ?, ?, ?);`;
      const [result] = await connection.execute(statement, [
        content,
        momentId,
        id,
        commentId,
      ]);
      return result;
    } catch (error) {
      console.info(error);
    }
  }

  async update({ content, commentId }) {
    try {
      const statement = `UPDATE comment SET content = ? WHERE id = ?;`;
      const [result] = await connection.execute(statement, [
        content,
        commentId,
      ]);
      return result;
    } catch (error) {
      console.info(error);
    }
  }

  async remove(commentId) {
    try {
      const statement = `DELETE FROM comment WHERE id = ?;`;
      const [result] = await connection.execute(statement, [
        commentId,
      ]);
      return result;
    } catch (error) {
      console.info(error);
    }
  }

  async getCommentsByMomentId(momentId) {
    try {
      const statement = `
      SELECT 
        m.id, content, m.comment_id commentId, m.createAt createTime,
        JSON_OBJECT('id', u.id, 'name', u.name) user
      FROM comment m
      LEFT JOIN users u ON u.id = m.user_id
      WHERE moment_id = ?;  
      `;
      const [result] = await connection.execute(statement, [
        momentId,
      ]);
      return result;
    } catch (error) {
      console.info(error);
    }
  }
}

module.exports = new CommentService();
