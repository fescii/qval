
const { checkAuthority } = require('../../utils').roleUtil;
const { Privileges } = require('../../configs').platformConfig;
const {
  addStory, editStory, removeStory, checkIfStoryExists,
  editTitle, editSlug
} = require('../../queries').storyQueries;
const {
  validateSlug
} = require('../../validators').storyValidator;


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
  if (!req.story) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.story;

  // Add story to the database
  const {
    story,
    error
  } = await addStory(req.user, data);

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
 * @function updateStory
 * @description Controller for updating story content
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateStory = async (req, res, next) => {
  // Check if the params or payload is available
  const { storyHash } = req.params;

  if (!req.story || !storyHash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // create data
  const data = req.story;

  // add author and story hash to the data
  data.author = req.user.hash;
  data.hash = storyHash;

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
  } = await editStory(storyHash, data);

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
 * @function checkStoryBySlug
 * @description Controller for checking if a story exists by slug
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateStoryBody = async (req, res, next) => {
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // validate the slug
  const valObj = await validateSlug(req.body);

  // if there is a validation error
  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Check if slug is available
  const {
    story,
    error
  } = await checkIfStoryExists(valObj.data.slug);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // if story is not available: return success
  if (!story) {
    return res.status(200).send({
      success: true,
      message: "Slug available for use!"
    });
  }

  // if story is available: return conflict
  return res.status(409).send({
    success: false,
    message: "Slug is already in use!"
  });
}

/**
 * @function updateTitle
 * @description Controller for updating story title
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 */
const updateTitle = async (req, res, next) => {
  // Check if the params or payload is available
  const { storyHash } = req.params;

  if (!req.story || !storyHash) {
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