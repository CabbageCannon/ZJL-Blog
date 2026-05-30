const express = require("express");
const controller = require("../controllers/authController");
const { authRequired } = require("../middleware/authMiddleware");

const router=express.Router();

router.post("/register",controller.register);
router.post("/login",controller.login);
router.get("/me",authRequired,controller.getMe);

module.exports=router;
