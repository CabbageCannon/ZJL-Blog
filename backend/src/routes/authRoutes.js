const express = require("express");
const controller = require("../controllers/authController");
const { authRequired } = require("../middleware/authMiddleware");
const { upload } = require("../config/upload");

const router=express.Router();

router.post("/register",controller.register);
router.post("/login",controller.login);
router.get("/me",authRequired,controller.getMe);
router.patch("/me",authRequired,controller.updateMe);
router.post("/me/avatar",authRequired,upload.single("avatar"),controller.updateAvatar);

module.exports=router;
