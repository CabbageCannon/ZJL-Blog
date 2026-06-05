// Express应用装配文件：中间件、静态资源、路由、错误处理
const express = require("express");
const cors = require("cors");
const path = require("path");
const diaryRoutes = require("./routes/diaryRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// 允许访问该后端的端口
const allowedOrigins = [
  "https://zjl-blog.netlify.app"
];

// 如果环境变量NODE_ENV不是production就认为在本地开发环境
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5500");
  allowedOrigins.push("http://127.0.0.1:5500");
}
// app.use就是往express请求处理链中注册功能

// 处理跨域，服务器与前端在不同的端口，理论上前端无法访问后端，这就是跨域
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  }
}));
// 后端会自动json.parse()
app.use(express.json());

// 把登录注册路由器挂载到/api/auth路径下
app.use("/api/auth", authRoutes);
// 把生活区日记路由器挂载到/api/life/diaries路径下
app.use("/api/life/diaries", diaryRoutes);

app.use(errorHandler);

module.exports = app;