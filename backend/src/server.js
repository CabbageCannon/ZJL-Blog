// 只负责启动服务
const app = require("./app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Life API running at http://localhost:${PORT}`);
})