// import models
const { Sequelize, View, Subscribe } = require('../../models').models;

/**
 * @function getTotalTopicsUserIsSubscribedTo
 * @description Get total topics user is subscribed to
 * @param {String} - author - User's hash
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
 * @function getTotalUserViews
 * @description Get user total views: all time
 * @param {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user all time views | rejects with error)
*/
const  getTotalUserViews = async user => {
  try {
    return await View.count({
      where: { 
        author: user
      }
    });
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function getTotalUserViewsThisMonth
 * @description Get user stories and replies views(where view date is in the last 30 days.
 * @param {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies views | rejects with error)
*/
const  getTotalUserViewsThisMonth = async user => {
  try {
    return await View.count({
      where: { 
        author: user,
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
 * @param {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies views | rejects with error)
*/
const getTotalPreviousMonthUserViews = async user => {
  try {
    return await View.count({
      where: { 
        author: user,
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
 * @function getTotalUserRepliesViews
 * @description Get user replies views(where view date is in the last 30 days.)
 * @param {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total replies views | rejects with error)
*/
const getTotalUserRepliesViews = async user => {
  try {
    return await View.count({
      where: {
        author: user,
        kind: 'reply'
      }
    });
  }
  catch (error) {
    throw error;
  }
}


/**
 * @function getTotalUserStoriesViews
 * @description Get user stories views(where view date is in the last 30 days.)
 * @param {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories views | rejects with error)
*/
const getTotalUserStoriesViews = async user => {
  try {
    return await View.count({
      where: {
        author: user,
        kind: 'story'
      }
    });
  }
  catch (error) {
    throw error;
  }
}



// Export module
module.exports = {
  getTotalTopicsUserIsSubscribedTo, getTotalUserViews,
  getTotalUserViewsThisMonth, getTotalPreviousMonthUserViews,
  getTotalUserRepliesViews, getTotalUserStoriesViews
}