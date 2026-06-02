const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { JWT_SELECT } = require("../middleware/authMiddleware");

// 用户注册
async function register(req, res, next) {
  try {
    const { username, password, nickname } = req.body || {};

    // 一些基础的校验
    if (!username || !password) {
      return res.status(400).json({ message: "用户名和密码不能为空" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "密码至少需要 6 位" });
    }

    const existedUser = await userModel.findUserByUsername(username);
    if (existedUser) {
      return res.status(400).json({ message: "用户名已存在" });
    }

    // 生成密码哈希
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.createUser({
      username: username,
      nickname: nickname,
      passwordHash: passwordHash,
      createdAt: new Date().toString()
    });

    res.status(201).json({
      user,
      token: createToken(user)
    })
  } catch (error) {
    next(error)
  }
}

// 用户登录
async function login(req, res, next) {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(401).json({ message: "用户名和密码不能为空" });
    }

    const user = await userModel.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        createdAt: user.createdAt
      },
      token: createToken(user)
    })

  } catch (error) {
    next(error);
  }
}

// 产生用户对应的token
function createToken(user) {
  // jwt.sign(要生成token的用户信息，密钥，配置项)
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      nickname: user.nickname
    },
    JWT_SELECT,
    {
      // token七天后过期
      expiresIn: "7d"
    }
  )
}

function getMe(req, res) {
  res.json({
    user: req.user
  })
}

module.exports = {
  register,
  login,
  getMe
}