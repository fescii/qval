// Import action queries from storyQueries
const { likeStory, likeReply, viewContent } = require('../../queries').storyQueries;
const { addActivity } = require('../../bull');

/**
 * @function likeStory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const likeStoryController = async (req, res, next) => {
  // get hash(story hash) from the params
  const { hash } = req.params;

  // check if the story hash is available in the request object
  if (!hash || !req.user) {
    const error = new Error('Story hash or user data is undefined!');
    return next(error);
  }

  // Like the story
  const {
    liked,
    error
  } = await likeStory(req.user.hash, hash.toUpperCase());

  // check if there is an error
  if (error) {
    return next(error);
  }

  // add activity to the queue
  if (liked) {
    addActivity({
      kind: 'story', action: 'like', author: req.user.hash, name: req.user.name,
      to: null, target: hash.toUpperCase(), verb: 'liked',
      nullable: false,
    });
  }   

  // return response
  return res.status(200).json({
    success: true,
    liked: liked,
    message: `You've ${liked ? 'like' : 'unlike'} the story`
  });
}

/**
 * @function likeReplyController
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const likeReplyController = async (req, res, next) => {
  // get hash(story hash) from the params
  const { hash } = req.params;

  // check if the story hash is available in the request object
  if (!hash || !req.user) {
    const error = new Error('Story hash or user data is undefined!');
    return next(error);
  }

  // Like the story
  const {
    liked,
    error
  } = await likeReply(req.user.hash, hash.toUpperCase());

  // check if there is an error
  if (error) {
    return next(error);
  }

  // add activity to the queue
  if (liked) {
    addActivity({
      kind: 'reply', action: 'like', author: req.user.hash, name: req.user.name,
      to: null, target: hash.toUpperCase(), verb: 'liked',
      nullable: false,
    });
  }

  // return response
  return res.status(200).json({
    success: true,
    liked: liked,
    message: `You've ${liked ? 'like' : 'unlike'} the reply`
  });
}

/**
 * @function viewContentController
 * @description - This function is used to view the content of the story, reply, user profile, etc.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const viewContentController = async (req, res, next) => {
  // get hash(story hash) from the params
  const { hash, kind } = req.params;

  // check if the story hash is available in the request object
  if (!hash || !req.user) {
    const error = new Error('Story hash or user data is undefined!');
    return next(error);
  }

  // Like the story
  const {
    viewed,
    error
  } = await viewContent(req.user.hash, hash.toUpperCase(), kind);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return response
  return res.status(200).json({
    success: true,
    viewed: viewed,
    message: `You ${viewed ? 'viewed' : 'unview'} the content`
  });
}

// Export the controllers
module.exports = {
  likeStoryController, likeReplyController,
  viewContentController
} 