// import all queries from the storyQueues
const {
  getUserStoriesStats, getUserRepliesStats,
  fetchUserStories, fetchUserReplies, fetchUserActivities,
  fetchUserNotifications, totalUnreadNotifications
} = require('../../queries').userQueries;

/**
 * @function fetchStoriesStats
 * @description Controller for finding all stories stats by views, likes, and replies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const fetchStoriesStats = async(req, res, next) => {
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

  // Find the stories
  const {
    stories,
    error
  } = await getUserStoriesStats(reqData);

  // check if there is an error
  if (error) {
    // console.log(error)
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: 'Stories fetched successfully',
    stories
  });
}

/**
 * @function fetchRepliesStats
 * @description Controller for finding all replies stats by views, likes, and replies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const fetchRepliesStats = async(req, res, next) => {
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

  // Find the stories
  const {
    replies,
    error
  } = await getUserRepliesStats(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: 'Replies fetched successfully',
    replies
  });
}

/**
 * @function getStories
 * @description Controller for finding all stories by a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getStories = async(req, res, next) => {
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

  // Find the stories
  const {
    stories,
    error
  } = await fetchUserStories(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: 'Stories fetched successfully',
    stories
  });
}

/**
 * @function getReplies
 * @description Controller for finding all replies by a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getReplies = async(req, res, next) => {
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

  // Find the stories
  const {
    replies,
    error
  } = await fetchUserReplies(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: 'Replies fetched successfully',
    replies
  });
}

/**
 * @function getActivities
 * @description Controller for finding all activities by a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || or pass the error to the next middleware
*/
const getActivities = async(req, res, next) => {
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

  // Find the stories
  const {
    activities,
    error
  } = await fetchUserActivities(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: 'Activities fetched successfully',
    activities
  });
}

/**
 * @function getNotifications
 * @description Controller for finding all notifications by a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || or pass the error to the next middleware
*/
const getNotifications = async(req, res, next) => {
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

  // Find the stories
  const {
    notifications,
    error
  } = await fetchUserNotifications(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: 'Notifications fetched successfully',
    notifications
  });
}

/**
 * @function getUnreadNotifications
 * @description Controller for finding all unread notifications by a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || or pass the error to the next middleware
*/
const getUnreadNotifications = async(req, res, next) => {
  // create user hash from the request object
  const user = req.user;

  // check user is not found
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User not found'
    });
  }

  // Find the stories
  const {
    unreadNotifications,
    error
  } = await totalUnreadNotifications(user.hash);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: 'Unread notifications fetched successfully',
    unreadNotifications
  });
}


// export the module
module.exports = {
  fetchStoriesStats, fetchRepliesStats,
  getStories, getReplies, getActivities,
  getNotifications, getUnreadNotifications
}