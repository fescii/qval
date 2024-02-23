const { dbConfig } = require('../configs');
const supabase = dbConfig.supabase;


const { postValidator } = require('../validators');


// Controller to register new users
const createPost = async (req, res) => {

  // Get validated payload data from request object
  const payload = req.body;
  const user = req.user;

  try {
    const postData = await postValidator.newPostValidator(payload);

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        user: user.sub,
        title: postData.title,
        tags: postData.tags,
        introduction: postData.introduction
      }])


    if (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while adding the blog post!"
      });
    }

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

module.exports = {
  createPost
}