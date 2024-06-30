// import all author queries from the storyQueues
const { 
  findStoriesByAuthor, findRepliesByAuthor,
  findFollowersByAuthor, findFollowingByAuthor 
} = require('../../queries').storyQueries;

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

  // check if the author hash is available in the request object
  if (!hash || !page) {
    const error = new Error('Author hash or page is undefined!');
    return next(error);
  }

  // convert the page and total stories to integer with zero fallback
  page = parseInt(page, 10) || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash: hash.toUpperCase(),
    user,
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
      message: 'No stories found!'
    });
  }

  // check if stories is empty
  if (data.stories.length === 0) {
    return res.status(404).json({
      success: true,
      data,
      message: 'No stories found!'
    });
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.stories ? 'Stories found!' : 'No stories found!',
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
    hash: hash.toUpperCase(),
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
 * @function findUserFollowers
 * @description Controller for finding followers by author/user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const findUserFollowers = async(req, res, next) => {
  // get the author hash from the request params
  const { hash } = req.params;

  // get page from the query
  let page = req.query.page || 1;

  // get total followers from the query
  let totalFollowers = req.query.total || 0;

  // check if the author hash is available in the request object
  if (!hash || !page || !totalFollowers) {
    const error = new Error('Author hash or page or total followers is undefined!');
    return next(error);
  }

  // convert the page and total followers to integer with zero fallback
  page = parseInt(page, 10) || 1;

  totalFollowers = parseInt(totalFollowers, 10) || 0;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash: hash.toUpperCase(),
    user,
    totalFollowers,
    page,
    limit: 10
  }

  // Find the followers
  const {
    data,
    error
  } = await findFollowersByAuthor(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // check if there is no data
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'No followers found!'
    });
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.followers ? 'Followers found!' : 'No followers found!',
    data
  });
}

/**
 * @function findUserFollowing
 * @description Controller for finding following by author/user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const findUserFollowing = async(req, res, next) => {
  // get the author hash from the request params
  const { hash } = req.params;

  // get page from the query
  let page = req.query.page || 1;

  // get total following from the query
  let totalFollowing = req.query.total || 0;

  // check if the author hash is available in the request object
  if (!hash || !page || !totalFollowing) {
    const error = new Error('Author hash or page or total following is undefined!');
    return next(error);
  }

  // convert the page and total following to integer with zero fallback
  page = parseInt(page, 10) || 1;

  totalFollowing = parseInt(totalFollowing, 10) || 0;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    hash: hash.toUpperCase(),
    user,
    totalFollowing,
    page,
    limit: 10
  }

  // Find the following
  const {
    data,
    error
  } = await findFollowingByAuthor(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // check if there is no data
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'No following found!'
    });
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.following ? 'Following found!' : 'No following found!',
    data
  });
}

// export the controllers
module.exports = {
  findAuthorStories, findAuthorReplies,
  findUserFollowers, findUserFollowing
}