const db = require('../config/db');

// 找到用户的信息
async function findUserByUsername(username) {
  const result = await db.query(
    `SELECT
      id,
      username,
      nickname,
      password_hash as "passwordHash",
      created_at as "createdAt",
      image_path as "imagePath"
      FROM users WHERE username = $1`,
    [username]
  )

  return result.rows[0];
}

async function findUserById(id) {
  const result = await db.query(
    `SELECT
      id,
      username,
      nickname,
      created_at as "createdAt",
      image_path as "imagePath"
      FROM users WHERE id = $1`,
    [id]
  );

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
    createdAt,
    imagePath: null
  }
}

async function updateUserProfile(id, profileInfo) {
  const { nickname } = profileInfo;

  const result = await db.query(
    `UPDATE users
     SET nickname = $1
     WHERE id = $2
     RETURNING id, username, nickname, created_at as "createdAt", image_path as "imagePath"`,
    [nickname, id]
  );

  return result.rows[0];
}

async function updateUserAvatar(id, imagePath) {
  const result = await db.query(
    `UPDATE users
     SET image_path = $1
     WHERE id = $2
     RETURNING id, username, nickname, created_at as "createdAt", image_path as "imagePath"`,
    [imagePath, id]
  );

  return result.rows[0];
}

module.exports = {
  findUserByUsername,
  findUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar
}
