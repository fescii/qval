// import models
const { User, sequelize, Sequelize, Stories, Replies, Views, Subscribe, Like } = require('../../models');


/**
 * @function getTotalTopicsUserIsSubscribedTo
 * @description Get total topics user is subscribed to
 * @paramm {String} - author - User's hash
 * @returns {Promise} - Promise (resolves total topics user is subscribed to | rejects with error)
*/
const getTotalTopicsUserIsSubscribedTo = async author => {
  try {
    return await Subscribe.count({where: { author }});
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function getAllUserStoryHashes
 * @description Get all user story hashes
 * @paramm {String} - author - User's hash
 * @returns {Promise} - Promise (resolves all user story hashes | rejects with error)
*/
const getAllUserStoryHashes = async author => {
  try {
    return await Stories.findAll({where: { author }, attributes: ['hash']});
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function getUserRepliesHashes
 * @description Get user replies hashes
 * @paramm {String} - author - User's hash
 * @returns {Promise} - Promise (resolves user replies hashes | rejects with error)
*/
const getUserRepliesHashes = async author => {
  try {
    return await Replies.findAll({where: { author }, attributes: ['hash']});
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function getTotalUserViews
 * @description Get user stories and replies views(where view date is in the last 30 days, and target in user stories and replies(array of hashes))
 * @paramm {Array} - hashes - story and replies hashes in an array
 * @returns {Promise} - Promise (resolves user total stories and replies views | rejects with error)
*/
const getTotalUserViews = async hashes => {
  try {
    return await Views.count({
      where: { 
        target: { [Sequelize.Op.in]: hashes },
        createdAt: { [Sequelize.Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) }
      }
    });
  } 
  catch (error) {
    throw error;
  }
}


/**
 * @function getTotalPreviousMonthUserViews
 * @description Get user stories and replies views(where view date is in the last 60 days not last 30 days, and target in user stories and replies(array of hashes))
 * @paramm {Array} - hashes - story and replies hashes in an array
 * @returns {Promise} - Promise (resolves user total stories and replies views | rejects with error)
*/
const getTotalPreviousMonthUserViews = async hashes => {
  try {
    return await Views.count({
      where: { 
        target: { [Sequelize.Op.in]: hashes },
        createdAt: { 
          [Sequelize.Op.gt]: new Date(new Date() - 60 * 24 * 60 * 60 * 1000),
          [Sequelize.Op.lt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function getTotalUserStoryLikes
 * @description Get user stories likes: in the last 30 days
 * @paramm {Array} - hashes - story hashes in an array
 * @returns {Promise} - Promise (resolves user total stories likes | rejects with error)
*/
const getTotalUserStoryLikes = async hashes => {
  try {
    return await Like.count({
      where: { 
        target: { [Sequelize.Op.in]: hashes },
        createdAt: { [Sequelize.Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) }
      }
    });
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function getTotalUserstoryLikesInPreviousMonth
 * @description Get user stories likes: in the previous month(30-60 days)
 * @paramm {Array} - hashes - story hashes in an array
 * @returns {Promise} - Promise (resolves user total stories likes | rejects with error)
*/
const getTotalUserstoryLikesInPreviousMonth = async hashes => {
  try {
    return await Like.count({
      where: { 
        target: { [Sequelize.Op.in]: hashes },
        createdAt: { 
          [Sequelize.Op.gt]: new Date(new Date() - 60 * 24 * 60 * 60 * 1000),
          [Sequelize.Op.lt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function getTotalUserRepliesLikes
 * @description Get user replies likes: in the last 30 days
 * @paramm {Array} - hashes - replies hashes in an array
 * @returns {Promise} - Promise (resolves user total replies likes | rejects with error)
*/
const getTotalUserRepliesLikes = async hashes => {
  try {
    return await Like.count({
      where: { 
        target: { [Sequelize.Op.in]: hashes },
        createdAt: { [Sequelize.Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) }
      }
    });
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function getTotalUserRepliesLikesInPreviousMonth
 * @description Get user replies likes: in the previous month(30-60 days)
 * @paramm {Array} - hashes - replies hashes in an array
 * @returns {Promise} - Promise (resolves user total replies likes | rejects with error)
*/
const getTotalUserRepliesLikesInPreviousMonth = async hashes => {
  try {
    return await Like.count({
      where: { 
        target: { [Sequelize.Op.in]: hashes },
        createdAt: { 
          [Sequelize.Op.gt]: new Date(new Date() - 60 * 24 * 60 * 60 * 1000),
          [Sequelize.Op.lt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });
  } 
  catch (error) {
    throw error;
  }
}