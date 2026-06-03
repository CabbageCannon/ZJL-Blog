// 接请求,做基础校验,调用model,返回相应
const fs = require("fs");
const path = require("path");
const model = require("../models/diaryModel");

// 获取日记数据 req请求对象 res相应对象 next express中的错误传递函数
async function getDiaries(req, res, next) {
  const userId = req.user.id;
  try {
    const rows = await model.listDiaries(userId);
    res.json(rows);
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
    let imageUrl = null;
    let imageRatio = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      imageRatio = body.imageRatio;
    }

    // 400是错误状态码
    if (!title && !content && !imageUrl) return res.status(400).json({ message: "title/content/image required" });

    const created = await model.createDiary({
      userId, mood, title, content, imageUrl, createdAt, imageRatio
    });

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

    if(changes===0){
      // 删除失败直接返回404
      return res.status(404).json({
        message:"日记不存在或无权删除"
      })
    }

    if (row && row.imageUrl) {
      const filePath = path.join(__dirname, "../../", row.imageUrl);
      // 传入的回调函数是删除失败调用的回调函数,这里即便删除失败也暂时不影响主流程,因此暂时为空
      fs.unlink(filePath, () => { });
    }

    // res.status(200).json({success:true});
    // res.json默认状态码就是200 OK
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDiaries,
  postDiary,
  deleteDiary
};