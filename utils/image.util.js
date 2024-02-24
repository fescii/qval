const { dbConfig } = require('../configs');
const supabase = dbConfig.supabase;

uploadImage = async (file, filePath) => {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (error) {
    throw error
  }
  else {
    console.log(data);
    return data;
  }

}

module.exports = {
  uploadImage
};