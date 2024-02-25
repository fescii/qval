const { dbConfig } = require('../configs');
const supabase = dbConfig.supabase;

const { postValidator } = require('../validators');


// Controller for creating new comment
const createComment = async (req, res) => {
  // Get post id from request parameters
  const postId = req.params["postId"];

  // Get request body
  const payload = req.body;

  try {
    const commentData = await postValidator.commentValidator(payload);

    // noinspection JSUnresolvedReference
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        post: postId,
        name: commentData.name,
        email: commentData.email,
        content: commentData.content
      }])
      .select();

    if (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while creating the comment!"
      });
    }

    // On success return response to the user
    return res.status(200).send({
      success: true,
      data: data,
      message: "Comment was created successfully!"
    });
  }
  catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
};


// Controller for deleting section
const deleteComment = async (req, res) => {

  // Get section id from request parameters
  const commentId = req.params["commentId"];

  // noinspection JSUnresolvedReference
  const { error } = await supabase
    .from('sections')
    .delete()
    .eq('id', commentId)


  if (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while deleting the comment!"
    });
  }

  // On success return response to the user
  return res.status(200).send({
    success: true,
    message: "Comment section was delete successfully!"
  });
};

module.exports = {
  createComment,
  deleteComment
}