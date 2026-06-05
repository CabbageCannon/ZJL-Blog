// 图片压缩
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const QUALITY = 0.82;
const TYPE = "image/jpeg";

export async function compressImageFile(file) {
  // 传入的不是文件，直接返回
  if (!file) return null;

  // 传入的不是图片，直接返回
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const image = await loadImage(file);

  const { newWidth, newHeight } = getTargetSize(image.naturalWidth, image.naturalHeight);

  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;

  // 获取画布的绘画环境
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, newWidth, newHeight);

  const blob = await canvasToBlob(canvas);

  // 避免压缩越压越大
  if (!blob || blob.size >= file.size) {
    return file;
  }

  return new File(
    [blob],
    replaceFileExtension(file.name),
    {
      type: TYPE,
      lastModified: Date.now()
    }
  )
}

// 加载图片
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    }

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("图片读取失败"));
    }

    image.src = url;
  })
}

// 缩放图片
function getTargetSize(originWidth, originHeight) {
  const widthRatio = MAX_WIDTH / originWidth;
  const heightRatio = MAX_HEIGHT / originHeight;
  const ratio = Math.min(widthRatio, heightRatio, 1);

  const newWidth = Math.round(originWidth * ratio);
  const newHeight = Math.round(originHeight * ratio);

  return { newWidth, newHeight };
}

// canvas转blob
function canvasToBlob(canvas) {
  return new Promise((resolve, _) => {
    canvas.toBlob(blob => {
      resolve(blob);
    }, TYPE, QUALITY);
  })
}

// 改文件后缀
function replaceFileExtension(fileName) {
  const ext = TYPE === "image/webp" ? ".webp" : ".jpg";
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  return `${baseName}${ext}`;
}