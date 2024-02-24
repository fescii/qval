const { dbConfig } = require('../configs');
const supabase = dbConfig.supabase;

uploadImage = async (bucket, filePath, extName, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: `image/${extName}`,
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    throw error
  }
  else {
    // console.log(data);

    const urlData = await getPublicUrl(bucket, data.fullPath);
    // console.log(urlData);
    return urlData.publicUrl;
  }
}

const getPublicUrl = async(bucket, path) => {
  const { data, error } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path)

  if (error) {
    throw error;
  }

  return data;
}


module.exports = {
  uploadImage
};