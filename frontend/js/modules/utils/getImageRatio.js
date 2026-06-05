// 获取图片的宽高比例
export function getImageRatio(file){
  return new Promise((resolve,reject)=>{
    if(!file){
      resolve(null);
      return;
    }

    const img=new Image();
    // 创建临时资源
    const url=URL.createObjectURL(file);

    img.onload=()=>{
      const width=img.naturalWidth;
      const height=img.naturalHeight;

      // 释放创建的临时资源
      URL.revokeObjectURL(url);

      resolve({
        imageWidth:width,
        imageHeight:height,
        imageRatio:Number((width/height).toFixed(6))
      });
    }

    img.onerror=()=>{
      console.log(1);
      URL.revokeObjectURL(url);
      reject(new Error("图片读取失败"));
    }

    // 让Image对象读取这个地址的图片文件
    img.src=url;
  })
}