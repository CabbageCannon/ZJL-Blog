const db = require('../config/db');

// 找到用户的信息
async function findUserByUsername(username) {
  const result = await db.query(
    `SELECT id,username,nickname,password_hash as "passwordHash",created_at as "createdAt"
      FROM users WHERE username = $1`,
    [username]
  )

  return result.rows[0];
}

// 创建用户
async function createUser(userInfo) {
  const { username, nickname, passwordHash, createdAt } = userInfo;

  const result = await db.query(
    `INSERT INTO users (username,nickname,password_hash,created_at)
    VALUES($1,$2,$3,$4)
    RETURNING id`,
    [username, nickname, passwordHash, createdAt]
  )

  return {
    id:result.rows[0].id,
    username,
    nickname,
    createdAt
  }
}

module.exports = {
  findUserByUsername,
  createUser
}