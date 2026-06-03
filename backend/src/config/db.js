const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, '../../zjl_blog.db');

const db = new sqlite3.Database(dbPath, (err) => {
  // 数据库成功打开后err===null
  if (err) {
    console.error("SQLite connect failed:", err.message);
    return;
  }
  console.log("SQLite connected:", dbPath);
})

// 建立数据库
// serialize强制一个执行完再执行下一个
db.serialize(() => {
  // 开启外键支持
  db.run("PRAGMA foreign_keys = ON")

  // 用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      nickname TEXT,
      image_url TEXT,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
      )`)

  // 建立生活区日记数据表
  // ON DELETE CASCADE表示如果用户删除了这个日记也删除
  db.run(`
    CREATE TABLE IF NOT EXISTS diaries(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      mood TEXT DEFAULT '🥰',
      title TEXT,
      content TEXT,
      image_url TEXT,
      image_ratio,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE
    )
    `);

});

// 将该数据库作为接口暴露出来
module.exports = db;