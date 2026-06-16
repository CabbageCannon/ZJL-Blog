const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const userModel = require("../models/userModel");
const { JWT_SELECT } = require("../middleware/authMiddleware");
const supabase = require("../config/supabase");
const { attachSignedImageUrls } = require("../utils/attachSignedImageUrls");

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
      user: (await attachSignedImageUrls([user],getAvatarBucket))[0],
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
      user: (await attachSignedImageUrls([user],getAvatarBucket()))[0],
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
      id: user.id
    },
    JWT_SELECT,
    {
      // token七天后过期
      expiresIn: "7d"
    }
  )
}

async function getMe(req, res, next) {
  try {
    const user = await userModel.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }

    res.json({
      user: (await attachSignedImageUrls([user],getAvatarBucket()))[0]
    })
  } catch (error) {
    next(error);
  }
}

// 更新昵称
async function updateMe(req, res, next) {
  try {
    const nickname = (req.body?.nickname || "").trim();

    if (!nickname) {
      return res.status(400).json({ message: "昵称不能为空" });
    }

    if (nickname.length > 20) {
      return res.status(400).json({ message: "昵称不能超过 20 个字符" });
    }

    const user = await userModel.updateUserProfile(req.user.id, { nickname });

    res.json({
      user: await (await attachSignedImageUrls([user],getAvatarBucket()))[0],
      token: createToken(user)
    });
  } catch (error) {
    next(error);
  }
}

// 更新头像
async function updateAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "请选择头像图片" });
    }

    const currentUser = await userModel.findUserById(req.user.id);
    const bucket = getAvatarBucket();
    const ext = path.extname(req.file.originalname || ".jpg") || ".jpg";
    const imagePath = `user-${req.user.id}/${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;

    const { error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(imagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) throw uploadError;

    const user = await userModel.updateUserAvatar(req.user.id, imagePath);

    if (currentUser?.imagePath) {
      // 删除桶中旧的照片
      await supabase
        .storage
        .from(bucket)
        .remove([currentUser.imagePath]);
    }

    res.json({
      user: (await attachSignedImageUrls([user],getAvatarBucket()))[0],
      token: createToken(user)
    });
  } catch (error) {
    next(error);
  }
}

function getAvatarBucket() {
  const bucket = process.env.SUPABASE_AVATAR_BUCKET;

  if (!bucket) {
    throw new Error("SUPABASE_AVATAR_BUCKET is not configured")
  }

  return bucket;
}

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  updateAvatar
}
