const { auth } = require('../../configs/mpesa.config');

const { checkAuthority } = require('../../utils').roleUtil;
const { Privileges } = require('../../configs').platformConfig;
const {
  addStory, editStory, removeStory, checkIfStoryExists,
  editTitle, editSlug, findStoriesByQuery, publishStory
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
 * @function publishStory
 * @description Controller for publishing a story content
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object || or calls next middleware
*/
const publishAStory = async (req, res, next) => {
  // Check if the params or payload is available
  const { hash } = req.params;

  if (!req.user) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // create data
  const data = {
    auth: req.user.hash,
    hash: hash.toUpperCase()
  }

  // Create access data - (For authorizing user)
  const access = {
    section: hash.toUpperCase(),
    privilege: Privileges.Publish,
    user: userId,
    key: 'action'
  }

  // Check if the user has access to publish the story
  const hasAccess = await checkAuthority(access);

  // If user does not have access return unauthorized
  if (!hasAccess) {
    return res.status(401).send({
      success: false,
      message: "You are not authorized to publish this story!"
    });
  }

  // Publish the story content
  const {
    story,
    error
  } = await publishStory(data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Check if story was not found
  if (!story) {
    // Return the 404 response
    return res.status(404).send({
      success: false,
      message: "Story not you are trying to publish was not found!"
    });
  }

  // Return success response
  return res.status(200).send({
    success: true,
    story: story,
    message: "Story content was published successfully!",
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
  const { hash } = req.params;

  if (!req.story || !hash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // create data
  const data = req.story;

  // add author and story hash to the data
  data.author = req.user.hash;
  data.hash = hash.toUpperCase();

  // Create access data - (For authorizing user)
  const access = {
    section: hash.toUpperCase(),
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
  } = await editStory(data);

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
const checkStoryBySlug = async (req, res, next) => {
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
  const { hash } = req.params;

  if (!req.story || !hash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // add author and story hash to the data
  const data = req.story;
  data.author = req.user.hash;
  data.hash = hash.toUpperCase();

  // Create access data - (For authorizing user)
  const access = {
    section: hash.toUpperCase(),
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
  } = await editTitle(data);

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
 * @function updateSlug
 * @description Controller for updating story slug
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateSlug = async (req, res, next) => {
  // Check if the params or payload is available
  const { hash } = req.params;

  if (!req.story || !hash) {
    const error = new Error('Payload data or params data is undefined!');
    return next(error)
  }

  // add author and story hash to the data
  const data = req.story;
  data.author = req.user.hash;
  data.hash = hash.toUpperCase();

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
    section: hash.toUpperCase(),
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
    error
  } = await editSlug(data);

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
    message: "Story slug was updated successfully!",
  });
}

/**
 * @function findStories
 * @description Controller for finding stories by query
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const findStories = async (req, res, next) => {
  // Check if the query is available
  const { q } = req.query;

  if (!q) {
    const error = new Error('Query data is undefined!');
    return next(error)
  }

  // Find stories by query
  const {
    stories,
    error
  } = await findStoriesByQuery(q);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Check if stories were not found
  if (!stories) {
    // Return the 404 response
    return res.status(404).send({
      success: false,
      message: "No story match your query!"
    });
  }

  // Return the response
  return res.status(200).send({
    success: true,
    stories: stories,
    message: "Stories found successfully!",
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
  const { hash } = req.params;

  if (!req.user || !hash) {
    const error = new Error('Params data or payload is undefined!');
    return next(error)
  }

  // Create access data - (For authorizing user)
  const access = {
    section: hash.toUpperCase(),
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
    deleted,
    error
  } = await removeStory(hash.toUpperCase());

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Check if story was not found
  if (!deleted) {
    // Return the 404 response
    return res.status(404).send({
      success: false,
      message: "Story you are trying to delete was not found!"
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
  createStory, updateStory, deleteStory,
  checkStoryBySlug, updateTitle, updateSlug,
  findStories, publishAStory
}