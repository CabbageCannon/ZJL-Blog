// Express应用装配文件：中间件、静态资源、路由、错误处理
const express = require("express");
const cors = require("cors");
const path = require("path");
const diaryRoutes = require("./routes/diaryRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// app.use就是往express请求处理链中注册功能

// 处理跨域，服务器与前端在不同的端口，理论上前端无法访问后端，这就是跨域
app.use(cors());
// 后端会自动json.parse()
app.use(express.json());

// 把../uploads文件夹下的文件暴露给浏览器，前端访问前缀需要填/uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// 把路由器挂载到/api/life/diaries路径下
app.use("/api/life/diaries", diaryRoutes);

app.use(errorHandler);

module.exports = app;