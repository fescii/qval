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
        content: commentData.content,
        active: true
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
    .from('comments')
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
    message: "Comment was delete successfully!"
  });
};


// Controller for creating a reply
const createReply = async (req, res) => {
  // Get post id from request parameters
  const commentId = req.params["commentId"];

  // Get request body
  const payload = req.body;

  try {
    const replyData = await postValidator.commentValidator(payload);

    // noinspection JSUnresolvedReference
    const { data, error } = await supabase
      .from('replies')
      .insert([{
        comment: commentId,
        name: replyData.name,
        email: replyData.email,
        content: replyData.content,
        active: true
      }])
      .select();

    if (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while creating the reply!"
      });
    }

    // On success return response to the user
    return res.status(200).send({
      success: true,
      data: data,
      message: "Reply was created successfully!"
    });
  }
  catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
};


// Controller for deleting a reply
const deleteReply = async (req, res) => {

  // Get section id from request parameters
  const replyId = req.params["replyId"];

  // noinspection JSUnresolvedReference
  const { error } = await supabase
    .from('replies')
    .delete()
    .eq('id', replyId)

  if (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while deleting the the reply!"
    });
  }

  // On success return response to the user
  return res.status(200).send({
    success: true,
    message: "Reply was delete successfully!"
  });
};

module.exports = {
  createComment,
  deleteComment,
  createReply,
  deleteReply
}