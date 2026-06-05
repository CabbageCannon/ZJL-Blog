// 接请求,做基础校验,调用model,返回相应
// const fs = require("fs");
const path = require("path");
const model = require("../models/diaryModel");
const supabase = require("../config/supabase");

// 获取日记数据 req请求对象 res相应对象 next express中的错误传递函数
async function getDiaries(req, res, next) {
  const userId = req.user.id;
  try {
    const rows = await model.listDiaries(userId);
    const diaries = await attachSignedImageUrls(rows);
    res.json(diaries);
  } catch (err) {
    next(err);
  }
}

// 上传日记数据
async function postDiary(req, res, next) {
  const userId = req.user.id;
  try {
    const body = req.body || {};

    const mood = (body.mood || "🥰").trim();
    const title = (body.title || "").trim();
    const content = (body.content || "").trim();
    const createdAt = new Date().toString();
    let imagePath = null;
    let imageRatio = null;
    if (req.file) {
      // 如果有上传文件，将文件上传到SUPABASE的storage中
      const ext = path.extname(req.file.originalname || ".jpg");
      imagePath = `user-${userId}/${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;

      const { error } = await supabase
        .storage
        .from(process.env.SUPABASE_STORAGE_BUCKET)
        .upload(imagePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        })

      if (error) throw error;

      imageRatio = body.imageRatio;
    }

    // 400是错误状态码
    if (!title && !content && !imagePath) return res.status(400).json({ message: "title/content/image required" });

    let created = await model.createDiary({
      userId, mood, title, content, imagePath, createdAt, imageRatio
    });

    created = (await attachSignedImageUrls([{}, created]))[1];

    // 状态码201表示创建成功
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

// 删除日记数据
async function deleteDiary(req, res, next) {
  const userId = req.user.id;
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "invalid id" });
    }

    const row = await model.findDiaryImageById(id, userId);
    const changes = await model.removeDiary(id, userId);

    if (changes === 0) {
      // 删除失败直接返回404
      return res.status(404).json({
        message: "日记不存在或无权删除"
      })
    }

    if (row && row.imagePath) {
      await supabase
        .storage
        .from(process.env.SUPABASE_STORAGE_BUCKET)
        .remove([row.imagePath]);
    }

    // res.status(200).json({success:true});
    // res.json默认状态码就是200 OK
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// 处理后端获取的日记数据
async function attachSignedImageUrls(rows) {
  return Promise.all(rows.map(async row => {
    if (!row.imagePath) {
      return {
        ...row,
        imageUrl: null
      };
    }

    const { data, error } = await supabase
      .storage
      .from(process.env.SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(row.imagePath, 60 * 60)

    if (error) throw error;

    return {
      ...row,
      imageUrl: data.signedUrl
    }
  }))
}

module.exports = {
  getDiaries,
  postDiary,
  deleteDiary
};