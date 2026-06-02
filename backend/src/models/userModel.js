const db = require('../config/db');

// 找到用户的信息
function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id,username,nickname,password_hash as passwordHash,created_at as createdAt
        FROM users
        WHERE username = ?`,
      [username],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    )
  })
}

// 创建用户
function createUser(userInfo) {
  const { username, nickname, passwordHash, createdAt } = userInfo;

  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO users (username,nickname,password_hash,created_at)
      VALUES(?,?,?,?)`,
      [username, nickname, passwordHash, createdAt],
      function (err) {
        if (err) return reject(err);

        resolve({
          id: this.lastID,
          username,
          nickname,
          createdAt
        })
      });
  })
}

module.exports = {
  findUserByUsername,
  createUser
}