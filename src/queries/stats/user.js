// import models
const { where } = require('sequelize');
const { sequelize, Sequelize, Stories, Replies, Views, Subscribe, Like } = require('../../models');
const { auth } = require('../../configs/mpesa.config');


/**
 * @function getTotatTopicsUserIsSubscribedTo
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
 * @function getTotalUserViews
 * @description Get user stories and replies views(where view date is in the last 30 days.
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies views | rejects with error)
*/
const getTotalUserViews = async user => {
  try {
    return await Views.count({
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
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories and replies views | rejects with error)
*/
const getTotalPreviousMonthUserViews = async user => {
  try {
    return await Views.count({
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
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total replies views | rejects with error)
*/
const getTotalUserRepliesViews = async user => {
  try {
    return await Views.count({
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
 * @function getTotalUserRepliesViewsLastMonth
 * @description Get user replies views(where view date between 30 and 60 days ago.)
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total replies views | rejects with error)
*/
const getTotalUserRepliesViewsLastMonth = async user => {
  try {
    return await Views.count({
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
 * @function getTotalUserStoriesViews
 * @description Get user stories views(where view date is in the last 30 days.)
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories views | rejects with error)
*/
const getTotalUserStoriesViews = async user => {
  try {
    return await Views.count({
      where: {
        author: user,
        kind: 'story',
        createdAt: { [Sequelize.Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) }
      }
    });
  }
  catch (error) {
    throw error;
  }
}


/**
 * @function getTotalUserStoriesViewsLastMonth
 * @description Get user stories views(where view date between 30 and 60 days ago.)
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total stories views | rejects with error)
*/
const getTotalUserStoriesViewsLastMonth = async user => {
  try {
    return await Views.count({
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
 * @function getTotalUserStoryLikes
 * @description Get user likes: for all stories user has published(the story has likes field, add all likes from all stories user has published.)
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total story likes | rejects with error)
*/
const getTotalUserStoryLikes = async user => {
  try {
    return await Story.sum('likes', { where: { author: user } });
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function getTotalUserReplyLikes
 * @description Get user likes: for all replies user has published(the reply has likes field, add all likes from all replies user has published.)
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total reply likes | rejects with error)
*/
const getTotalUserReplyLikes = async user => {
  try {
    return await Reply.sum('likes', { where: { author: user } });
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function getTotalUserStoryLikesThisMonth
 * @description Get user likes: for all stories user has published(include count likes where like date is in the last 30 days.): then add all likes from all stories user has published.
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total story likes | rejects with error)
*/
const getTotalUserStoryLikesThisMonth = async user => {
  try {
    const stories =  await Story.findAll({
      attributes: {
        include: [
          [sequelize.fn('count', sequelize.col('story_likes.id')), 'total_likes']
        ],
      },
      where: {
        author: user,
      },
      // include sequelize count all likes where like date is in the last 30 days
      include: [
        {
          model: Like,
          as: 'story_likes',
          attributes: [],
          where: {
            createdAt: { [Sequelize.Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) }
          }
        }
      ]
    })

    return stories.reduce((acc, story) => acc + story.dataValues.total_likes, 0);
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function getTotalUserStoryLikesLastMonth
 * @description Get user likes: for all stories user has published(include count likes where like date is between 30 and 60 days ago.): then add all likes from all stories user has published.
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total story likes | rejects with error)
*/
const getTotalUserStoryLikesLastMonth = async user => {
  try {
    const stories =  await Story.findAll({
      attributes: {
        include: [
          [sequelize.fn('count', sequelize.col('story_likes.id')), 'total_likes']
        ],
      },
      where: {
        author: user,
      },
      // include sequelize count all likes where like date is between 30 and 60 days ago
      include: [
        {
          model: Like,
          as: 'story_likes',
          attributes: [],
          where: {
            createdAt: {
              [Sequelize.Op.gt]: new Date(new Date() - 60 * 24 * 60 * 60 * 1000),
              [Sequelize.Op.lt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }
      ]
    })

    return stories.reduce((acc, story) => acc + story.dataValues.total_likes, 0);
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function getTotalUserReplyLikesThisMonth
 * @description Get user likes: for all replies user has published(include count likes where like date is in the last 30 days.): then add all likes from all replies user has published.
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total reply likes | rejects with error)
*/
const getTotalUserReplyLikesThisMonth = async user => {
  try {
    const replies =  await Reply.findAll({
      attributes: {
        include: [
          [sequelize.fn('count', sequelize.col('reply_likes.id')), 'total_likes']
        ],
      },
      where: {
        author: user,
      },
      // include sequelize count all likes where like date is in the last 30 days
      include: [
        {
          model: Like,
          as: 'reply_likes',
          attributes: [],
          where: {
            createdAt: { [Sequelize.Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) }
          }
        }
      ]
    });

    return replies.reduce((acc, reply) => acc + reply.dataValues.total_likes, 0);
  }
  catch (error) {
    throw error;
  }
}
/**
 * @function getTotalUserReplyLikesLastMonth
 * @description Get user likes: for all replies user has published(include count likes where like date is between 30 and 60 days ago.): then add all likes from all replies user has published.
 * @paramm {String} - user - User's hash
 * @returns {Promise} - Promise (resolves user total reply likes | rejects with error)
*/
const getTotalUserReplyLikesLastMonth = async user => {
  try {
    const replies =  await Reply.findAll({
      attributes: {
        include: [
          [sequelize.fn('count', sequelize.col('reply_likes.id')), 'total_likes']
        ],
      },
      where: { author: user },
      // include sequelize count all likes where like date is between 30 and 60 days ago
      include: [
        {
          model: Like,
          as: 'reply_likes',
          attributes: [],
          where: {
            createdAt: {
              [Sequelize.Op.gt]: new Date(new Date() - 60 * 24 * 60 * 60 * 1000),
              [Sequelize.Op.lt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }
      ]
    });

    return replies.reduce((acc, reply) => acc + reply.dataValues.total_likes, 0);
  }
  catch (error) {
    throw error;
  }
}



// Export module
module.exports = {
  getTotalTopicsUserIsSubscribedTo, getTotalUserViews, getTotalPreviousMonthUserViews,
  getTotalUserRepliesViews, getTotalUserRepliesViewsLastMonth, 
  getTotalUserStoriesViews, getTotalUserStoriesViewsLastMonth, 
  getTotalUserStoryLikes, getTotalUserReplyLikes, getTotalUserStoryLikesThisMonth, getTotalUserStoryLikesLastMonth,
  getTotalUserReplyLikesThisMonth, getTotalUserReplyLikesLastMonth
}