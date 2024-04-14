const { validateStoryContent } = require('../validators').storyValidator;
const { addStory, editStoryContent } = require('../queries').storyQueries;

// Controller for creating a new story
const createStory = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.story_data || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.story_data;
  const userId = req.user.id;


  // Add story to the database
  const {
    story,
    error
  } = await addStory(userId, data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Return the response
  return res.status(201).send({
    success: true,
    story: story,
    message: "Story was added successfully!",
  });
}

// Controller for updating story content
const updateStoryContent = async (req, res, next) => {
  // Check if the params or payload is available
  const { storyHash } = req.params;

  if (!req.story_data || !storyHash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.story_data;
  const userId = req.user.id;


  // Validate story content data
  const valObj = await validateStoryContent(data);


  // Check if there is a validation error
  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Update the story content
  const {
    story,
    error
  } = await editStoryContent(storyHash, valObj.data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Check if story was updated
  if (story) {
    // Return the response
    return res.status(200).send({
      success: true,
      story: story,
      message: "Story was updated successfully!",
    });
  }

  // Else story was not found in the database
  return res.status(404).send({
    success: false,
    message: "Story not you are trying to update was not found!"
  });
}

// Export the module
module.exports = {
  createStory, updateStoryContent
}