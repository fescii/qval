// import all queries from the storyQueues
const {
  fetchUserActivities, fetchUserPeopleActivities, fetchUserRepliesActivities,
  fetchUserStoriesActivities, fetchUserTopicsActivities
} = require('../../queries').userQueries.activities;


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

  try {
    // Find the stories
    const activities = await fetchUserActivities(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Activities fetched successfully',
      activities
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function getStoriesActivities
 * @description Controller for finding all stories activities by a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || or pass the error to the next middleware
*/
const getStoriesActivities = async(req, res, next) => {
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

  try {
    const reqData = {
      user: user.hash,
      page: parseInt(page),
      limit: 10
    }
  
    // Find the stories
    const activities = await fetchUserStoriesActivities(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Activities fetched successfully',
      activities
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function getRepliesActivities
 * @description Controller for finding all replies activities by a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || or pass the error to the next middleware
*/
const getRepliesActivities = async(req, res, next) => {
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

  try {
    const reqData = {
      user: user.hash,
      page: parseInt(page),
      limit: 10
    }
  
    // Find the stories
    const activities = await fetchUserRepliesActivities(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Activities fetched successfully',
      activities
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function getTopicsActivities
 * @description Controller for finding all topics activities by a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || or pass the error to the next middleware
*/
const getTopicsActivities = async(req, res, next) => {
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

  try {
    const reqData = {
      user: user.hash,
      page: parseInt(page),
      limit: 10
    }
  
    // Find the stories
    const activities = await fetchUserTopicsActivities(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Activities fetched successfully',
      activities
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function getPeopleActivities
 * @description Controller for finding all people activities by a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || or pass the error to the next middleware
*/

const getPeopleActivities = async(req, res, next) => {
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

  try {
    const reqData = {
      user: user.hash,
      page: parseInt(page),
      limit: 10
    }
  
    // Find the stories
    const activities = await fetchUserPeopleActivities(reqData);

    // return the response
    return res.status(200).json({
      success: true,
      message: 'Activities fetched successfully',
      activities
    });
  } catch (error) {
    return next(error);
  }
}

// export the module
module.exports = {
  getActivities, getStoriesActivities,
  getRepliesActivities, getTopicsActivities,
  getPeopleActivities
}