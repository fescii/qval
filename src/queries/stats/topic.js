// import models
const { Sequelize, View, } = require('../../models').models;

/**
 * @function getTotalTopicViews
 * @description Get topic total views: all time
 * @paramm {String} - topic - Topic's hash
 * @returns {Promise} - Promise (resolves topic all time views | rejects with error)
*/
const getTotalTopicViews = async topic => {
  try {
    return await View.count({
      where: { 
        target: topic
      }
    });
  } 
  catch (error) {
    throw error;
  }
}

/**
 * @function getTotalTopicViewsThisMonth
 * @description Get  views(where view date is in the last 30 days.
 * @paramm {String} - topic - Topics's hash
 * @returns {Promise} - Promise (resolves topic total  views | rejects with error)
*/
const getTotalTopicViewsThisMonth = async topic => {
  try {
    return await View.count({
      where: { 
        target: topic,
        createdAt: { [Sequelize.Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) }
      }
    });
  } 
  catch (error) {
    throw error;
  }
}


/**
 * @function getTotalPreviousMonthTopicViews
 * @description Get topic stories and replies views(where view date is in the last 60 days not last 30 days, and target in topic stories and replies(array of hashes))
 * @paramm {String} - topic - Topic's hash
 * @returns {Promise} - Promise (resolves topic total stories and replies views | rejects with error)
*/
const getTotalPreviousMonthTopicViews = async topic => {
  try {
    return await View.count({
      where: { 
        target: topic,
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


// Export module
module.exports = {
  getTotalTopicViewsThisMonth, getTotalTopicViews,
  getTotalPreviousMonthTopicViews
}