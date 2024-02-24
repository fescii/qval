const { dbConfig } = require('../configs');
const supabase = dbConfig.supabase;

const { postValidator } = require('../validators');


// Controller for creating new article section
const createSection = async (req, res) => {

  // Get post id from request parameters
  const postId = req.params.postId;

  // Get request body
  const payload = req.body;
  // const user = req.user;

  try {
    const sectionData = await postValidator.sectionValidator(payload);

    // console.log(user);
    const { data, error } = await supabase
      .from('sections')
      .insert([{
        post: postId,
        title: sectionData.title,
        content: sectionData.content
      }])
      .select();


    if (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while creating the section!"
      });
    }

    // console.log(data);

    // On success return response to the user
    return res.status(200).send({
      success: true,
      data: data,
      message: "Article section was created successfully!"
    });

  }
  catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
};

// Controller for updating article section
const updateSection = async (req, res) => {

  // Get payload data from request body
  const payload = req.body;

  // Get section id from request parameters
  const sectionId = req.params.sectionId;

  try {
    const sectionData = await postValidator.sectionValidator(payload);

    // Update post to include uploaded file
    const { data: post, error } = await supabase
      .from('posts')
      .update({
        title: sectionData.title,
        content: sectionData.content
      })
      .eq('id', sectionId)
      .select()

    if (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while updating the article section!"
      });
    }

    // On success return response to the user
    return res.status(200).send({
      success: true,
      data: post,
      message: "Article section was updated successfully!"
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
const deleteSection = async (req, res) => {

  // Get section id from request parameters
  const sectionId = req.params.sectionId;

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', sectionId)


  if (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while deleting the article section!"
    });
  }

  // On success return response to the user
  return res.status(200).send({
    success: true,
    message: "Article section was delete successfully!"
  });
};

// Controller to register new users
const updateSectionImage = async (req, res) => {

  // Get section id from request parameters
  const sectionId = req.params.sectionId;

  // Update post to include uploaded file
  const { data, error } = await supabase
    .from('sections')
    .update({ cover: imagePath })
    .eq('id', sectionId)
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
  createSection,
  updateSection,
  deleteSection,
  updateSectionImage
}