const path = require('path');

const { fileConfig } = require('../configs');
const { imageUtil } = require('../utils');

const imageUpload = async(req, res, next) => {

  const postId = req.params.postId;

  fileConfig.upload.single('file')(req, res, async err => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: 'Error uploading the image.'
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "File was not provided!"
      });
    }
    try {
      const fileData = req.file;

      // Get File Extension
      const extName = path.extname(fileData.originalname);

      // Remove dot(.) from file extension
      const extension = extName.substring(1);

      // Create path for our file
      const newPath = `cover-${postId}.${extension}`;

      // Upload file to supabase
      const uploadedImagePath = await imageUtil.uploadImage('covers', newPath, extension, fileData);

      req.imagePath = uploadedImagePath;

      //Call the next function
      next();
    }
    catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: error.message
      });
    }
  });
}


const sectionImageUpload = async (req, res, next) => {

  const sectionId = req.params.sectionId;

  fileConfig.upload.single('file')(req, res, async err => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: 'Error uploading the image.'
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "File was not provided!"
      });
    }
    try {
      const fileData = req.file;

      // Get File Extension
      const extName = path.extname(fileData.originalname);

      // Remove dot(.) from file extension
      const extension = extName.substring(1);

      // Create path for our file
      const newPath = `cover-${sectionId}.${extension}`;

      // Upload file to supabase
      const uploadedImagePath = await imageUtil.uploadImage('covers', newPath, extension, fileData);

      req.imagePath = uploadedImagePath;

      //Call the next function
      next();
    }
    catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: error.message
      });
    }
  });
}

module.exports = {
  imageUpload,
  sectionImageUpload
}