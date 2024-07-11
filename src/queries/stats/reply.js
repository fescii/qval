// import models
const { sequelize, Sequelize, View } = require('../../models').models;
const {
  getReplyLikesLastMonth, getReplyLikesThisMonth,
  getReplyRepliesLastMonth, getReplyRepliesThisMonth
} = require('./raw').replies;

/**
 * @function totalReplyViewsThisMonth
 * @description Get user stories views(where view date is in the last 30 days.)
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies views | rejects with error)
*/
const totalReplyViewsThisMonth = async user => {
  try {
    return await View.count({
      where: { 
        author: user,
        kind: 'reply',
        createdAt: { [Sequelize.Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) }
      }
    });
  } 
  catch (error) {
    throw error;
  }
}


/**
 * @function totalReplyPreviousMonthViews
 * @description Get user stories views(where view date is between 30 and 60 days ago.)
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies views | rejects with error)
*/
const totalReplyPreviousMonthViews = async user => {
  try {
    return await View.count({
      where: { 
        author: user,
        kind: 'reply',
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
 * @function totalReplyLikesThisMonth
 * @description Get user stories likes(where like date is in the last 30 days.)
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies likes | rejects with error) 
*/
const totalReplyLikesThisMonth = async user => {
  try {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    return await sequelize.query(getReplyLikesThisMonth, {
      replacements: { 
        user, 
        start_date: thirtyDaysAgo.toISOString()
      },
      type: Sequelize.QueryTypes.SELECT
    });
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function totalReplyLikesLastMonth
 * @description Get user stories likes(where like date is between 30 and 60 days ago.)
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies likes | rejects with error) 
*/
const totalReplyLikesLastMonth = async user => {
  try {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(new Date() - 60 * 24 * 60 * 60 * 1000);
    return await sequelize.query(getReplyLikesLastMonth, {
      replacements: { 
        user, 
        start_date: sixtyDaysAgo.toISOString(),
        end_date: thirtyDaysAgo.toISOString()
      },
      type: Sequelize.QueryTypes.SELECT
    });
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function totalReplyRepliesThisMonth
 * @description Get user stories replies(where reply date is in the last 30 days.)
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies replies | rejects with error) 
*/
const totalReplyRepliesThisMonth = async user => {
  try {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    return await sequelize.query(getReplyRepliesThisMonth, {
      replacements: { 
        user, 
        start_date: thirtyDaysAgo.toISOString()
      },
      type: Sequelize.QueryTypes.SELECT
    });
  }
  catch (error) {
    throw error;
  }

}

/**
 * @function totalReplyRepliesLastMonth
 * @description Get user stories replies(where reply date is between 30 and 60 days ago.)
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies replies | rejects with error) 
*/
const totalReplyRepliesLastMonth = async user => {
  try {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(new Date() - 60 * 24 * 60 * 60 * 1000);
    return await sequelize.query(getReplyRepliesLastMonth, {
      replacements: { 
        user, 
        start_date: sixtyDaysAgo.toISOString(),
        end_date: thirtyDaysAgo.toISOString()
      },
      type: Sequelize.QueryTypes.SELECT
    });
  }
  catch (error) {
    throw error;
  }
}

// Export module
module.exports = {
  totalReplyViewsThisMonth,
  totalReplyPreviousMonthViews,
  totalReplyLikesThisMonth,
  totalReplyLikesLastMonth,
  totalReplyRepliesThisMonth,
  totalReplyRepliesLastMonth
}