// import all queries from the storyQueues
const {
  fetchUserReplies, fetchUserRepliesStats, fetchUserStories,
  fetchUserStoriesStats,
} = require('../../queries').userQueries.profile;

/**
 * @function getUserStoriesStats
 * @description Controller for finding all stories stats by views, likes, and replies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getUserStoriesStats = async(req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;

  // create user hash from the request object
  const user = req.user;

  // check user is not found
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User not found'
    });
  }

  const reqData = {
    user: user.hash,
    page: parseInt(page),
    limit: 10
  }

  try {
    // Find the stories
    const stories = await fetchUserStoriesStats(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Stories fetched successfully',
      stories
    });
  }
  catch (error) {
    return next(error);
  }
}

/**
 * @function getUserRepliesStats
 * @description Controller for finding all replies stats by views, likes, and replies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getUserRepliesStats = async(req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;

  // create user hash from the request object
  const user = req.user;

  // check user is not found
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User not found'
    });
  }

  const reqData = {
    user: user.hash,
    page: parseInt(page),
    limit: 10
  }

  try {
    // Find the stories
    const replies = await fetchUserRepliesStats(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Replies fetched successfully',
      replies
    });

  } catch (error) {
    return next(error);
  }
}

/**
 * @function getUserStories
 * @description Controller for finding all stories by a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getUserStories = async(req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;

  // create user hash from the request object
  const user = req.user;

  // check user is not found
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User not found'
    });
  }

  const reqData = {
    user: user.hash,
    page: parseInt(page),
    limit: 10
  }

  try {
    // Find the stories
    const stories = await fetchUserStories(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Stories fetched successfully',
      stories
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function getUserReplies
 * @description Controller for finding all replies by a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getUserReplies = async(req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;

  // create user hash from the request object
  const user = req.user;

  // check user is not found
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User not found'
    });
  }

  const reqData = {
    user: user.hash,
    page: parseInt(page),
    limit: 10
  }

  try {
    // Find the stories
    const replies = await fetchUserReplies(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Replies fetched successfully',
      replies
    });
  } catch (error) {
    return next(error);
  }
}

// export the module
module.exports = {
  getUserStoriesStats, getUserRepliesStats,
  getUserStories, getUserReplies
}