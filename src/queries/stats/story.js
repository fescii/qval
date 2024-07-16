// import models
const { sequelize, Sequelize, View } = require('../../models').models;
const {
  getStoryLikesLastMonth, getStoryLikesThisMonth, 
  getStoryRepliesLastMonth, getStoryRepliesThisMonth 
} = require('./raw').stories;

/**
 * @function totalStoryViewsThisMonth
 * @description Get user stories views(where view date is in the last 30 days.)
 * @param {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies views | rejects with error)
*/
const totalStoryViewsThisMonth = async user => {
  try {
    return await View.count({
      where: { 
        author: user,
        kind: 'story',
        createdAt: { [Sequelize.Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) }
      }
    })
  } 
  catch (error) {
    throw error;
  }
}


/**
 * @function totalStoryPreviousMonthViews
 * @description Get user stories views(where view date is between 30 and 60 days ago.)
 * @param {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies views | rejects with error)
*/
const totalStoryPreviousMonthViews = async user => {
  try {
    return await View.count({
      where: { 
        author: user,
        kind: 'story',
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
 * @function totalStoryLikesThisMonth
 * @description Get user stories likes(where like date is in the last 30 days.)
 * @param {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies likes | rejects with error) 
*/
const totalStoryLikesThisMonth = async user => {
  try {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    return await sequelize.query(getStoryLikesThisMonth, 
      { 
        replacements: { 
          user, 
          start_date: thirtyDaysAgo.toISOString()
        },
        type: Sequelize.QueryTypes.SELECT
      }
    );
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function totalStoryLikesPreviousMonth
 * @description Get user stories likes(where like date is between 30 and 60 days ago.)
 * @param {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies likes | rejects with error)
*/
const totalStoryLikesPreviousMonth = async user => {
  try {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(new Date() - 60 * 24 * 60 * 60 * 1000);
    return await sequelize.query(getStoryLikesLastMonth, 
      { 
        replacements: { 
          user, 
          start_date: thirtyDaysAgo.toISOString(),
          end_date: sixtyDaysAgo.toISOString()
        },
        type: Sequelize.QueryTypes.SELECT
      }
    );
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function totalStoryRepliesThisMonth
 * @description Get user stories replies(where reply date is in the last 30 days.)
 * @param {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies replies | rejects with error)
*/
const totalStoryRepliesThisMonth = async user => {
  try {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    return await sequelize.query(getStoryRepliesThisMonth, 
      { 
        replacements: { 
          user, 
          start_date: thirtyDaysAgo.toISOString()
        },
        type: Sequelize.QueryTypes.SELECT
      }
    );
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function totalStoryRepliesPreviousMonth
 * @description Get user stories replies(where reply date is between 30 and 60 days ago.)
 * @param {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies replies | rejects with error)
*/
const totalStoryRepliesPreviousMonth = async user => {
  try {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(new Date() - 60 * 24 * 60 * 60 * 1000);
    return await sequelize.query(getStoryRepliesLastMonth, 
      { 
        replacements: { 
          user, 
          start_date: thirtyDaysAgo.toISOString(),
          end_date: sixtyDaysAgo.toISOString()
        },
        type: Sequelize.QueryTypes.SELECT
      }
    );
  } 
  catch (error) {
    throw error;
  }
}

// Export module
module.exports = {
  totalStoryViewsThisMonth, totalStoryPreviousMonthViews,
  totalStoryLikesThisMonth, totalStoryLikesPreviousMonth,
  totalStoryRepliesThisMonth, totalStoryRepliesPreviousMonth
}