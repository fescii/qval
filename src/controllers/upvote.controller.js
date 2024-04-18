// Import from within the app (internal modules)
const { upvoteQuery, likeQuery } = require('../queries').upvoteQueries;

/**
 * @function upvoteStory
 * @description Controller for creating or deleting an upvote on a story
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const upvoteStory = async (req, res, next) => {
  // Check if the user or params is valid
  if (!req.user || !req.params) {
    const error = new Error('Param data or user data is undefined!');
    return next(error)
  }

  // Get story hash from params
  const storyHash = req.params.storyHash;

  // Get user id from user data
  const userId = req.user.id;

  // Perform the upvote query
  const { number, error } = await upvoteQuery(storyHash, userId);

  // If error occurred, return the error
  if (error) {
    return next(error);
  }

  // Return the success message
  return res.status(200).json({
    success: true,
    number: number,
    message: `Your upvote was ${number === 1 ? 'added' : 'removed'}.`,
  });
};


/**
 * @function likeOpinion
 * @description Controller for creating or deleting a like on an opinion
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const likeOpinion = async (req, res, next) => {
  // Check if the user or params is valid
  if (!req.user || !req.params) {
    const error = new Error('Param data or user data is undefined!');
    return next(error)
  }

  // Get opinion hash from params
  const opinionHash = req.params.opinionHash;

  // Get user id from user data
  const userId = req.user.id;

  // Perform the like query
  const { number, error } = await likeQuery(opinionHash, userId);

  // If error occurred, return the error
  if (error) {
    return next(error);
  }

  // Return the success message
  return res.status(200).json({
    success: true,
    number: number,
    message: `Your like was ${number === 1 ? 'added' : 'removed'}.`,
  });
};


/**
 * Export all the controllers as an object
*/
module.exports = {
  upvoteStory,
  likeOpinion
};