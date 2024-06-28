// import all queries from the storyQueues
const { findReplyReplies, findStoryReplies } = require('../../queries').storyQueries;

/**
 * @function getStoryReplies
 * @description Controller for finding all replies for a particular story
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getStoryReplies = async(req, res, next) => {
  // get the story hash from the request params
  const { hash } = req.params;

  // get page from the query
  let page = req.query.page || 1;

  // get total stories from the query
  let totalReplies = req.query.stories || 0;

  // check if the story hash is available in the request object
  if (!hash || !page || !totalReplies) {
    const error = new Error('Reply hash or page or total replies is undefined!');
    return next(error);
  }

  totalReplies = parseInt(totalReplies, 10) || 0;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash,
    user,
    totalStories,
    page: page = parseInt(page, 10) || 1,
    limit: 10
  }

  // Find the stories
  const {
    data,
    error
  } = await findStoryReplies(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // check if there is no data
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'No replies found!'
    });
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.replies ? 'Replies found!' : 'No replies found!',
    data
  });
}

/**
 * @function getReplyReplies
 * @description Controller for finding all replies for a particular reply
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getReplyReplies = async(req, res, next) => {
  // get the reply hash from the request params
  const { hash } = req.params;

  // get page from the query
  let page = req.query.page || 1;

  // get total replies from the query
  let totalReplies = req.query.replies || 0;

  // check if the reply hash is available in the request object
  if (!hash || !page || !totalReplies) {
    const error = new Error('Reply hash or page or total replies is undefined!');
    return next(error);
  }

  // convert the page and total replies to integer with zero fallback
  page = parseInt(page, 10) || 1;

  totalReplies = parseInt(totalReplies, 10) || 0;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash,
    user,
    totalReplies,
    page,
    limit: 10
  }

  // Find the replies
  const {
    data,
    error
  } = await findReplyReplies(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // check if there is no data
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'No replies found!'
    });
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.replies ? 'Replies found!' : 'No replies found!',
    data
  });
}

// export the controllers
module.exports = {
  getReplyReplies, getStoryReplies
}