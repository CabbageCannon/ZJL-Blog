// 负责接收图片上传+限制格式和大小+存到本地目录
// 用于处理磁盘文件的模块
const fs=require("fs");
const path=require("path");
// 用于解析上传文件的模块
const multer=require("multer");

// 将上传文件夹固定在uploads
const uploadDir=path.join(__dirname,"../../uploads");

// 检查是否存在这个文件夹，不存在的话就创建
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir,{recursive:true});
}

// 创建文件上传规则
const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,uploadDir);
  },
  filename:(req,file,cb)=>{
    // 获取文件后缀名
    const ext=path.extname(file.originalname || ".jpg");
    cb(null,`${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`);
  }
});

// 创建上传文件中间件
const upload=multer({
  storage,
  limits:{fileSize:2 * 1024 *1024},
  fileFilter:(req,file,cb)=>{
    if(!file.mimetype.startsWith("image/")){
      return cb(new Error("Only image files are allowed"));
    }
    cb(null,true);
  }
})

module.exports={
  upload,
  uploadDir
}

