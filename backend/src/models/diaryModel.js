// 负责数据库的CURD
const db = require("../config/db");

// 查询日记
function listDiaries(userId) {
  // 将db.all这个callback风格异步转换成promise风格异步(使得可以使用async/await)
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id,mood, title, content, image_url as imageUrl, created_at as createdAt,image_ratio as imageRatio
      FROM diaries WHERE user_id = ?
      ORDER BY created_at ASC`,
      [userId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    )
  })
}

// 创建日记
function createDiary(cardInfo) {
  let { userId,mood, title, content, imageUrl, imageRatio, createdAt } = cardInfo;
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO diaries (mood, title, content, image_url,image_ratio, created_at,user_id)
      VALUES(?, ?, ?, ?,?, ?,?)`,
      [mood, title, content, imageUrl, imageRatio, createdAt,userId],
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
function findDiaryImageById(id,userId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT image_url as imageUrl FROM diaries WHERE id = ? AND user_id = ?`,
      [id,userId],
      (err, row) => {
        if (err) return reject(err);

        resolve(row);
      }
    )
  })
}

// 移除日记
function removeDiary(id,userId) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM diaries WHERE id = ? AND user_id = ?`,
      [id,userId],
      function(err){
        if(err){
          return reject(err);
        }

        // 此处的this是SQL执行的结果对象，changes是影响的数据行数，成功删除一行数据就是1
        resolve(this.changes);
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
