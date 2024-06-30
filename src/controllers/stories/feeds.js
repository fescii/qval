// import all queries from the storyQueues
const { findReplyReplies, findStoryReplies, findStoryLikes, findReplyLikes } = require('../../queries').storyQueries;

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

  // check if the story hash is available in the request object
  if (!hash || !page) {
    const error = new Error('Reply hash or page is undefined!');
    return next(error);
  }

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash: hash.toUpperCase(),
    user,
    page: page = parseInt(page, 10) || 1,
    limit: 10
  }

  // Find the replies
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

  // check if the reply hash is available in the request object
  if (!hash || !page) {
    const error = new Error('Reply hash or pageis undefined!');
    return next(error);
  }

  // convert the page and total replies to integer with zero fallback
  page = parseInt(page, 10) || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash: hash.toUpperCase(),
    user,
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

/**
 * @function fetchStoryLikes
 * @description Controller for finding all likes for a particular story
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const fetchStoryLikes = async(req, res, next) => {
  // get the story hash from the request params
  const { hash } = req.params;

  // get page from the query
  let page = req.query.page || 1;

  // check if the story hash is available in the request object
  if (!hash || !page) {
    const error = new Error('Story hash or pageis undefined!');
    return next(error);
  }

  // convert the page and total likes to integer with zero fallback
  page = parseInt(page, 10) || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash: hash.toUpperCase(),
    user,
    page,
    limit: 10
  }

  // Find the likes
  const {
    data,
    error
  } = await findStoryLikes(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // check if there is no data
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'No likes found!'
    });
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.likes ? 'Likes found!' : 'No likes found!',
    data
  });
}

/**
 * @function fetchReplyLikes
 * @description Controller for finding all likes for a particular reply
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const fetchReplyLikes = async(req, res, next) => {
  // get the reply hash from the request params
  const { hash } = req.params;

  // get page from the query
  let page = req.query.page || 1;

  // check if the reply hash is available in the request object
  if (!hash || !page) {
    const error = new Error('Reply hash or page is undefined!');
    return next(error);
  }

  // convert the page and total likes to integer with zero fallback
  page = parseInt(page, 10) || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash: hash.toUpperCase(),
    user,
    page,
    limit: 10
  }

  // Find the likes
  const {
    data,
    error
  } = await findReplyLikes(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // check if there is no data
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'No likes found!'
    });
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.likes ? 'Likes found!' : 'No likes found!',
    data
  });
}

// export the controllers
module.exports = {
  getReplyReplies, getStoryReplies,
  fetchStoryLikes, fetchReplyLikes
}