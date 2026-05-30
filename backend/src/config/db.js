const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, '../../life.db');

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
  db.run(`
    CREATE TABLE IF NOT EXISTS diaries(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mood TEXT DEFAULT '🥰',
      title TEXT,
      content TEXT,
      image_url TEXT,
      created_at TEXT NOT NULL
    )
    `);
  db.run(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      inikname TEXT,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
      )`)
});

// 将该数据库作为接口暴露出来
module.exports=db;