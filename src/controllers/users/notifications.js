const {
 fetchUserNotifications, fetchUserReadNotifications,
 fetchUserUnreadNotifications, totalUnreadNotifications
} = require('../../queries').userQueries.notifications;

/**
 * @function getNotifications
 * @description Controller for finding all notifications by a user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
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

  try {
    // Find the stories
    const notifications = await fetchUserNotifications(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      notifications
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function getReadNotifications
 * @description Controller for finding all read notifications by a user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || or pass the error to the next middleware
*/
const getReadNotifications = async(req, res, next) => {
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
    const notifications = await fetchUserReadNotifications(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Read notifications fetched successfully',
      notifications
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function getUnreadNotifications
 * @description Controller for finding all unread notifications by a user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || or pass the error to the next middleware
*/
const getUnreadNotifications = async(req, res, next) => {
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
    const notifications = await fetchUserUnreadNotifications(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Unread notifications fetched successfully',
      notifications
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function getTotalUnreadNotifications
 * @description Controller for finding all unread notifications by a user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || or pass the error to the next middleware
*/
const getTotalUnreadNotifications = async(req, res, next) => {
  // create user hash from the request object
  const user = req.user;

  // check user is not found
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User not found'
    });
  }

  try {
    // Find the stories
    const total = await totalUnreadNotifications(user.hash);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Total unread notifications fetched successfully',
      total
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getNotifications, getReadNotifications,
  getUnreadNotifications, getTotalUnreadNotifications
}