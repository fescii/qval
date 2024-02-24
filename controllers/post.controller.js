const { dbConfig } = require('../configs');
const supabase = dbConfig.supabase;

const { postValidator } = require('../validators');


// Controller for creating new blog post/article
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
        status: false,
        tags: postData.tags,
        introduction: postData.introduction
      }])
      .select();


    if (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while adding the article!"
      });
    }

    // console.log(data);

    // On success return response to the user
    return res.status(200).send({
      success: true,
      data: data,
      message: "Article was created successfully!"
    });

  }
  catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
};

// Controller for updating Article/Post details
const updatePost = async (req, res) => {

  // Get validated payload data from request object
  const payload = req.body;
  // const user = req.user;

  const postId = req.params.postId;

  try {
    const postData = await postValidator.newPostValidator(payload);

    // Update post to include uploaded file
    const { data: post, error } = await supabase
      .from('posts')
      .update({
        title: postData.title,
        tags: postData.tags,
        introduction: postData.introduction
        })
      .eq('id', postId)
      .select()

    if (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while updating the article!"
      });
    }

    // On success return response to the user
    return res.status(200).send({
      success: true,
      data: post,
      message: "Article was updated successfully!"
    });
  }
  catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
};


// Controller for changing post from draft to published and vice versa
const updatePostStatus = async (req, res) => {

  // Get validated payload data from request object
  const payload = req.body;
  // const user = req.user;

  const postId = req.params.postId;

  if (payload.status === null || payload.status === undefined) {
    return res.status(400).send({
      success: false,
      message: "The status field is missing"
    });
  }

  // Update post to include uploaded file
  const { data: post, error } = await supabase
    .from('posts')
    .update({
      status: payload.status
    })
    .eq('id', postId)
    .select()

  if (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while updating the article!"
    });
  }

  // On success return response to the user
  return res.status(200).send({
    success: true,
    data: post,
    message: "Article was updated successfully!"
  });
};

// Controller for deleting post/article
const deletePost = async (req, res) => {

  // Get post/article id from  request parameters
  const postId = req.params.postId;

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)


  if (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while deleting the article!"
    });
  }

  // On success return response to the user
  return res.status(200).send({
    success: true,
    message: "Article was delete successfully!"
  });
};

// Controller to register new users
const updateCoverImage = async (req, res) => {

  // Get validated payload data from request object
  const postId = req.params.postId;
  const imagePath = req.imagePath;
  // const user = req.user;

  // Update post to include uploaded file
  const { data, error } = await supabase
    .from('posts')
    .update({ cover: imagePath })
    .eq('id', postId)
    .select()

  if (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while updating the article!"
    });
  }

  // On success return response to the user
  return res.status(200).send({
    success: true,
    data: data,
    message: "Cover image was updated successfully!"
  });
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  updatePostStatus,
  updateCoverImage
}