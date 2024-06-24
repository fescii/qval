// import all author queries from the storyQueues
const { findStoriesByAuthor, findRepliesByAuthor } = require('../../queries').storyQueries;

/**
 * @function findAuthorStories
 * @description Controller for finding stories by author
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const findAuthorStories = async(req, res, next) => {
  // get the author hash from the request params
  const { hash } = req.params;

  // get page from the query
  let page = req.query.page || 1;

  // get total stories from the query
  let totalStories = req.query.stories || 0;

  // check if the author hash is available in the request object
  if (!hash || !page || !totalStories) {
    const error = new Error('Author hash or page or total stories is undefined!');
    return next(error);
  }

  // convert the page and total stories to integer with zero fallback
  page = parseInt(page, 10) || 1;

  totalStories = parseInt(totalStories, 10) || 0;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash,
    user,
    totalStories,
    page,
    limit: 10
  }

  // Find the stories
  const {
    data,
    error
  } = await findStoriesByAuthor(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // check if there is no data
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Author has not created any story yet!'
    });
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: 'Stories found!',
    data
  });
}

/**
 * @function findAuthorReplies
 * @description Controller for finding replies by author
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const findAuthorReplies = async(req, res, next) => {
  // get the author hash from the request params
  const { hash } = req.params;

  // get page from the query
  let page = req.query.page || 1;

  // get total replies from the query
  let totalReplies = req.query.replies || 0;

  // check if the author hash is available in the request object
  if (!hash || !page || !totalReplies) {
    const error = new Error('Author hash or page or total replies is undefined!');
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
  } = await findRepliesByAuthor(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // check if there is no data
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Author has not created any reply yet!'
    });
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: 'Replies found!',
    data
  });
}

// export the controllers
module.exports = {
  findAuthorStories,
  findAuthorReplies
}