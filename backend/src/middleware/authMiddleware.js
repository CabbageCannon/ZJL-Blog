const jwt = require("jsonwebtoken");

// 生成密钥，用于验证token
const JWT_SELECT = process.env.JWT_SELECT || "zjl-blog-dev-secret";

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({ message: "未登录" });
  }

  try{
    req.user=jwt.verify(token,JWT_SELECT);
    console.log(req)
    next();
  }catch(err){
    res.status(401).json({message:"登录已过期"});
  }
}

module.exports={
  JWT_SELECT,
  authRequired
};