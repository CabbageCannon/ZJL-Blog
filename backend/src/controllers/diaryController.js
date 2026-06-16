const path = require("path");
const model = require("../models/diaryModel");
const supabase = require("../config/supabase");
const { attachSignedImageUrls } = require("../utils/attachSignedImageUrls");

async function getDiaries(req, res, next) {
  const userId = req.user.id;

  try {
    const rows = await model.listDiaries(userId);
    const diaries = await attachSignedImageUrls(rows,getDiaryBucket());
    res.json(diaries);
  } catch (err) {
    next(err);
  }
}

// 上传日记
async function postDiary(req, res, next) {
  const userId = req.user.id;
  let uploadedImagePath = null;
  let diaryCreated = false;

  try {
    const body = req.body || {};
    const mood = String(body.mood || "🙂").trim();
    const title = String(body.title || "").trim();
    const content = String(body.content || "").trim();
    const createdAt = new Date().toString();
    let imagePath = null;
    let imageRatio = null;

    if (!title && !content && !req.file) {
      return res.status(400).json({ message: "title/content/image required" });
    }

    if (req.file) {
      imagePath = await uploadDiaryImage(req.file, userId);
      uploadedImagePath = imagePath;
      imageRatio = body.imageRatio || null;
    }

    let created = await model.createDiary({
      userId,
      mood,
      title,
      content,
      imagePath,
      imageRatio,
      createdAt
    });
    diaryCreated = true;

    // 将存储在桶中的图片转换成可用的URL
    created = (await attachSignedImageUrls([created],getDiaryBucket()))[0];

    res.status(201).json(created);
  } catch (err) {
    // 图片上传成功但日记创建失败
    if (uploadedImagePath && !diaryCreated) {
      await removeDiaryImageQuietly(
        uploadedImagePath,
        "cleanup uploaded diary image after database create failure"
      );
    }

    next(err);
  }
}

// 删除日记
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
      return res.status(404).json({
        message: "日记不存在或无权删除"
      });
    }

    // row存在就获取imagePath，不存在直接返回undefined
    if (row?.imagePath) {
      await removeDiaryImageQuietly(
        row.imagePath,
        "remove diary image after database delete"
      );
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// 上传日记图片到storage中
async function uploadDiaryImage(file, userId) {
  const ext = path.extname(file.originalname || ".jpg") || ".jpg";
  const imagePath = `user-${userId}/${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;

  const { error } = await supabase
    .storage
    .from(getDiaryBucket())
    .upload(imagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;

  return imagePath;
}

// 删除日记图片
async function removeDiaryImage(imagePath) {
  const { error } = await supabase
    .storage
    .from(getDiaryBucket())
    .remove([imagePath]);

  if (error) throw error;
}

// 快速删除桶里的日记图片
async function removeDiaryImageQuietly(imagePath, reason) {
  try {
    await removeDiaryImage(imagePath);
  } catch (cleanupError) {
    console.error(`Failed to ${reason}:`, cleanupError);
  }
}

// 获取日记桶名称
function getDiaryBucket() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!bucket) {
    throw new Error("SUPABASE_STORAGE_BUCKET is not configured");
  }

  return bucket;
}

module.exports = {
  getDiaries,
  postDiary,
  deleteDiary
};
