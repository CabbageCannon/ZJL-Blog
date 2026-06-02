// 路由映射
const express = require("express");
const { upload } = require("../config/upload");
const controller = require("../controllers/diaryController");
const {authRequired}=require("../middleware/authMiddleware");

const router=express.Router();

router.get("/",authRequired,controller.getDiaries);
router.post("/",upload.single("image"),controller.postDiary);
router.delete("/:id",controller.deleteDiary);

module.exports=router;