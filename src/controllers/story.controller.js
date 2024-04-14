const { validateStoryContent } = require('../validators').storyValidator;
const { addStory, editStoryContent } = require('../queries').storyQueries;
const { checkAuthority } = require('../utils').roleUtil;

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

  // Create access data - (For authorizing user)
  const access = {
    section: storyHash,
    privilege: Privileges.Update,
    user: userId,
    key: 'action'
  }


  // Check if the user has access to update the story
  const hasAccess = await checkAuthority(access);


  // If user does not have access return unauthorized
  if (!hasAccess) {
    return res.status(401).send({
      success: false,
      message: "You are not authorized to update this story!"
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

  // Check if story was not found
  if (!story) {
    // Return the 404 response
    return res.status(404).send({
      success: false,
      message: "Story not you are trying to update was not found!"
    });
  }

  // Return success response
  return res.status(200).send({
    success: true,
    story: story,
    message: "Story was updated successfully!",
  });
}

// Export the module
module.exports = {
  createStory, updateStoryContent
}