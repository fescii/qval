// Import models
const { Sequelize, sequelize, Reply } = require('../../models').models;
const { repliesLoggedIn, feedReplies } = require('../raw').feed;
/**
 * @function findRepliesByQuery
 * @description Query to finding replies by query: using vector search
 * @param {Object} reqData - The request data
 * @returns {Object} - The replies object or null, and the error if any
*/
const findRepliesByQuery = async reqData => {
  try {
    const {
      query, user, page, limit
    } = reqData;

    // calculate the offset
    const offset = (page - 1) * limit;

    // trim the query
    let queryStr = query.trim();

    // refine the query: make the query to match containing, starting or ending with the query
    queryStr = queryStr.split(' ').map((q) => `${q.toLowerCase()}:*`).join(' | ');

    // add query to back to the req data
    const queryOptions = {
      user: user,
      query: queryStr,
      offset: offset,
      limit: limit,
    }
    
    // build the query(vector search)
    let replies = await Reply.search(queryOptions);


    // check if length is 0
    if (replies.length < 1) {
      return {
        data: {
          replies: [],
          limit: limit,
          offset: offset,
          last: true,
        },
        error: null
      }
    }

    const last = replies.length < limit;

    replies = replies.map(reply => {
      const data = reply.dataValues;
      data.you = user === data.author;
      return data;
    })

    // create a data object
    return { 
      data: {
        replies: replies,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { replies: null, error: error }
  }
}

/**
 * @function findTrendingReplies
 * @description Query to finding trending replies: using views and likes in the last 30 days
 * @param {Object} reqData - The request data
 * @returns {Object} - The replies object or null, and the error if any
*/
const findTrendingReplies = async reqData => {
  try {
    const {
      user, page, limit
    } = reqData;

    // calculate the offset
    const offset = (page - 1) * limit;
    
    let replies = null;

    // check if the user is logged in
    if (user) {
      replies = await trendingRepliesWhenLoggedIn(user, offset, limit);
    }
    else {
      replies = await trendingRepliesWhenLoggedOut(offset, limit);
    }

    const last = replies.length < limit;

    // create a data object
    return { 
      data: {
        replies: replies,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { replies: null, error: error }
  }
}

/**
 * @function trendingRepliesWhenLoggedIn
 * @description Query to finding trending replies when logged in: using likes in the last 30 days
 * @param {String} user - The user hash
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The replies object or null, and the error if any
*/
const trendingRepliesWhenLoggedIn = async (user, offset, limit) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const replies = await sequelize.query(repliesLoggedIn, {
      replacements: [user, thirtyDaysAgo, limit, offset],
      type: Sequelize.QueryTypes.SELECT
    });

    // Check if the replies exist
    if (replies.length < 1) {
      return [];
    }

    // return the replies: map the replies' dataValues
    return replies.map(reply => {
      reply.you = user === reply.author;
      return reply;
    });
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function trendingRepliesWhenLoggedOut
 * @description Query to finding trending replies when logged out: using views in the last 30 days
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The replies object or null, and the error if any
*/
const trendingRepliesWhenLoggedOut = async (offset, limit) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const replies = await sequelize.query(feedReplies, {
      replacements: [thirtyDaysAgo, limit, offset],
      type: Sequelize.QueryTypes.SELECT
    });

   // Check if the replies exist
   if (replies.length < 1) {
      return [];
    }

    // return the replies: map the replies' dataValues
    return replies.map(reply => {
      reply.you = false;
      return reply;
    });
  }
  catch (error) {
    throw error;
  }
}

// Export all queries as a single object
module.exports = {
  findRepliesByQuery, findTrendingReplies
};