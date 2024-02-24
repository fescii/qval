const path = require('path');
const { dbConfig, fileConfig } = require('../configs');
const supabase = dbConfig.supabase;

const { imageUtil } = require('../utils');


const { postValidator } = require('../validators');


// Controller to register new users
const createPost = async (req, res) => {

  // Get validated payload data from request object
  const payload = req.body;
  const user = req.user;

  try {
    const postData = await postValidator.newPostValidator(payload);

    // console.log(user);
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        user: user.id,
        title: postData.title,
        published: false,
        tags: postData.tags,
        introduction: postData.introduction
      }])
      .select();


    if (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while adding the blog post!"
      });
    }

    // console.log(data);

    // On success return response to the user
    return res.status(200).send({
      success: true,
      data: data,
      message: "Blog post was registered successfully!"
    });

  }
  catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
};

// Controller to register new users
const updateCoverImage = async (req, res) => {

  // Get validated payload data from request object
  const postId = req.params.postId;
  // const fileData = req.file;
  // const user = req.user;

  fileConfig.upload.single('file')(req, res, async err => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: 'Error uploading profile picture.'
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Post or file was not provided!"
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
      const image = await imageUtil.uploadImage('covers', newPath, extension, fileData);


      // Update post to include uploaded file
      const { data, error } = await supabase
        .from('posts')
        .update({ cover: image })
        .eq('id', postId)
        .select()

      if (error) {
        console.error(error);
        return res.status(500).send({
          success: false,
          message: "An error occurred while updating the blog post!"
        });
      }

      // On success return response to the user
      return res.status(200).send({
        success: true,
        data: data,
        message: "Blog post was updated successfully!"
      });


    }
    catch (error) {
      console.log(error);
      return res.status(400).send({
        success: false,
        message: error.message
      });
    }
  });
};

module.exports = {
  createPost,
  updateCoverImage
}