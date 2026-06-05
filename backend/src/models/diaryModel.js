// 负责数据库的CURD
const db = require("../config/db");

// 查询日记
async function listDiaries(userId) {
  const result = await db.query(
    `SELECT
      id,
      mood,
      title,
      content,
      image_path as "imagePath",
      created_at as "createdAt",
      image_ratio as "imageRatio"
    FROM diaries
    WHERE user_id = $1
    ORDER BY created_at ASC`,
    [userId]
  );

  return result.rows;
}

// 创建日记
async function createDiary(cardInfo) {
  const { userId, mood, title, content, imagePath, imageRatio, createdAt } = cardInfo;

  const result = await db.query(
    `INSERT INTO diaries (
      mood,
      title,
      content,
      image_path,
      image_ratio,
      created_at,
      user_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id`,
    [mood, title, content, imagePath, imageRatio, createdAt, userId]
  );

  return {
    id: result.rows[0].id,
    mood,
    title,
    content,
    imagePath,
    imageRatio,
    createdAt,
  };
}

// 查找日记图片
async function findDiaryImageById(id, userId) {
  const result = await db.query(
    `SELECT image_path as "imagePath"
     FROM diaries
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  return result.rows[0];
}

// 移除日记
async function removeDiary(id, userId) {
  const result = await db.query(
    `DELETE FROM diaries
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  return result.rowCount;
}

module.exports = {
  listDiaries,
  createDiary,
  findDiaryImageById,
  removeDiary
};
