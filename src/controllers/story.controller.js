
const { checkAuthority } = require('../utils').roleUtil;
const { Privileges } = require('../configs').platformConfig;
const {
  addStory, editStoryBody, editStoryTopics,
  editStoryContent, editStoryTitle,
  editStorySlug, removeStory
} = require('../queries').storyQueries;
const {
  validateStoryContent, validateStorySlug,
  validateStoryBody, validateStoryTitle,
  validateStoryTopics
} = require('../validators').storyValidator;


/**
 * @function createStory
 * @description Controller for creating a new story
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
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


/**
 * @function updateStoryContent
 * @description Controller for updating story content
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateStoryContent = async (req, res, next) => {
  // Check if the params or payload is available
  const { storyHash } = req.params;

  if (!req.body || !storyHash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.body;
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
    message: "Story content was updated successfully!",
  });
}

/**
 * @function updateStoryBody
 * @description Controller for updating story body
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateStoryBody = async (req, res, next) => {
  // Check if the params or payload is available
  const { storyHash } = req.params;

  if (!req.body || !storyHash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.body;
  const userId = req.user.id;

  // Validate story body data
  const valObj = await validateStoryBody(data);

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
  };

  // Check if the user has access to update the story
  const hasAccess = await checkAuthority(access);

  // If user does not have access return unauthorized
  if (!hasAccess) {
    return res.status(401).send({
      success: false,
      message: "You are not authorized to update this story!"
    });
  }

  // Update the story body
  const {
    story,
    error
  } = await editStoryBody(storyHash, valObj.data);

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
    message: "Story body was updated successfully!",
  });
}

/**
 * @function updateStoryTitle
 * @description Controller for updating story title
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 */
const updateStoryTitle = async (req, res, next) => {
  // Check if the params or payload is available
  const { storyHash } = req.params;

  if (!req.body || !storyHash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.body;
  const userId = req.user.id;

  // Validate story title data
  const valObj = await validateStoryTitle(data);

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
  };

  // Check if the user has access to update the story
  const hasAccess = await checkAuthority(access);

  // If user does not have access return unauthorized
  if (!hasAccess) {
    return res.status(401).send({
      success: false,
      message: "You are not authorized to update this story!"
    });
  }

  // Update the story title
  const {
    story,
    error
  } = await editStoryTitle(storyHash, valObj.data);

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
    message: "Story title was updated successfully!",
  });
}


/**
 * @function updateStorySlug
 * @description Controller for updating story slug
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateStorySlug = async (req, res, next) => {
  // Check if the params or payload is available
  const { storyHash } = req.params;

  if (!req.body || !storyHash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.body;
  const userId = req.user.id;

  // Validate story slug data
  const valObj = await validateStorySlug(data);

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
  };

  // Check if the user has access to update the story
  const hasAccess = await checkAuthority(access);

  // If user does not have access return unauthorized
  if (!hasAccess) {
    return res.status(401).send({
      success: false,
      message: "You are not authorized to update this story!"
    });
  }

  // Update the story slug
  const {
    story,
    exists,
    error
  } = await editStorySlug(storyHash, valObj.data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Check if story slug already exists
  if (exists) {
    return res.status(409).send({
      success: false,
      message: "Story with slug already exists or you didn't change the slug at all!"
    });
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
    message: "Story slug was updated successfully!",
  });
}


/**
 * @function updateStoryTopics
 * @description Controller for updating story topics
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateStoryTopics = async (req, res, next) => {
  // Check if the params or payload is available
  const { storyHash } = req.params;

  if (!req.body || !storyHash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.body;
  const userId = req.user.id;

  // Validate story topics data
  const valObj = await validateStoryTopics(data);

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
  };

  // Check if the user has access to update the story
  const hasAccess = await checkAuthority(access);

  // If user does not have access return unauthorized
  if (!hasAccess) {
    return res.status(401).send({
      success: false,
      message: "You are not authorized to update this story!"
    });
  }

  // Update the story topics
  const {
    story,
    error
  } = await editStoryTopics(storyHash, valObj.data);

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
    message: "Story topics were updated successfully!",
  });
}


/**
 * @function deleteStory
 * @description Controller for deleting a story
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const deleteStory = async (req, res, next) => {
  // Check if the params is available
  const { storyHash } = req.params;

  if (!req.user || !storyHash) {
    const error = new Error('Params data or payload is undefined!');
    return next(error)
  }

  // Get user data from request object
  const userId = req.user.id;

  // Create access data - (For authorizing user)
  const access = {
    section: storyHash,
    privilege: Privileges.Delete,
    user: userId,
    key: 'action'
  };

  // Check if the user has access to delete the story
  const hasAccess = await checkAuthority(access);

  // If user does not have access return unauthorized
  if (!hasAccess) {
    return res.status(401).send({
      success: false,
      message: "You are not authorized to delete this story!"
    });
  }

  // Remove the story
  const {
    story,
    error
  } = await removeStory(storyHash);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Check if story was not found
  if (!story) {
    // Return the 404 response
    return res.status(404).send({
      success: false,
      message: "Story not you are trying to delete was not found!"
    });
  }

  // Return success response
  return res.status(200).send({
    success: true,
    story: story,
    message: "Story was deleted successfully!",
  });
}

/**
 * Exporting Controllers
*/
module.exports = {
  createStory, updateStoryContent,
  updateStoryTopics, updateStoryBody,
  updateStoryTitle, updateStorySlug, deleteStory
}