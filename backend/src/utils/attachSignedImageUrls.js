const supabase = require("../config/supabase");

// 传入数组，数组中的对象需要拥有imagePath这个属性
async function attachSignedImageUrls(rows,bucket) {
  return Promise.all(rows.map(async row => {
    if (!row.imagePath) {
      return {
        ...row,
        imageUrl: null
      };
    }

    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(row.imagePath, 60 * 60);

    if (error) throw error;

    return {
      ...row,
      imageUrl: data.signedUrl
    };
  }));
}

module.exports = {
  attachSignedImageUrls
}