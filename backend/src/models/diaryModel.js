// 负责数据库的CURD
const db = require("../config/db");

// 查询日记
function listDiaries() {
  // 将db.all这个callback风格异步转换成promise风格异步(使得可以使用async/await)
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, mood, title, content, image_url as imageUrl, created_at as createdAt,image_ratio as imageRatio
      FROM diaries
      ORDER BY id ASC`,
      [],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    )
  })
}

// 创建日记
function createDiary(cardInfo) {
  let { mood, title, content, imageUrl, imageRatio, createdAt } = cardInfo;
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO diaries (mood, title, content, image_url,image_ratio, created_at)
      VALUES(?, ?, ?, ?,?, ?)`,
      [mood, title, content, imageUrl, imageRatio, createdAt],
      function (err) {
        if (err) return reject(err);

        resolve({
          id: this.lastID,
          mood,
          title,
          content,
          imageUrl,
          imageRatio,
          createdAt
        })
      }
    )
  })
}

// 查找日记图片
function findDiaryImageById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT image_url as imageUrl FROM diaries WHERE id = ?`,
      [id],
      (err, row) => {
        if (err) return reject(err);

        resolve(row);
      }
    )
  })
}

// 移除日记
function removeDiary(id) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM diaries WHERE id = ?`,
      [id],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    )
  })
}

module.exports = {
  listDiaries,
  createDiary,
  findDiaryImageById,
  removeDiary
};
