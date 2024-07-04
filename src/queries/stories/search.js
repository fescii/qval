// Import models
const { Sequelize, sequelize, Story, User, Reply, View } = require('../../models').models;

const {
  trendingRepliesWhenLoggedIn, trendingRepliesWhenLoggedOut,
  trendingStoriesWhenLoggedIn, trendingStoriesWhenLoggedOut
} = require('./trending')

/**
 * @function findStoriesByQuery
 * @description Query to finding story by query: using vector search 
 * @param {Object} reqData - The request data
 * @returns {Object} - The stories object or null, and the error if any
*/
const findStoriesByQuery = async (reqData) => {
  try {
    const {
      query, user, page, limit
    } = reqData;

    // calculate the offset
    const offset = (page - 1) * limit;

    // trim the query
    query = query.trim();

    // refine the query: make the query to match containing, starting or ending with the query
    query = query.split(' ').map((q) => `${q}:*`).join(' | ');

    // add query to back to the req data
    const queryOptions = {
      user: user,
      query: query,
      offset: offset,
      limit: limit,
    }
    
    // build the query(vector search)
    const stories = await Story.search(queryOptions);

    const last = stories.length < limit;

    // create a data object
    return { 
      data: {
        stories: stories,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { stories: null, error: error }
  }
}

/**
 * @function findTrendingStories
 * @description Query to finding trending stories: using views and likes in the last 30 days
 * @param {Object} reqData - The request data
 * @returns {Object} - The stories object or null, and the error if any
*/
const findTrendingStories = async (reqData) => {
  try {
    const {
      user, page, limit
    } = reqData;

    // calculate the offset
    const offset = (page - 1) * limit;
    
    let stories = null;

    // check if the user is logged in
    if (user) {
      stories = await trendingStoriesWhenLoggedIn(user, offset, limit);
    }
    else {
      stories = await trendingStoriesWhenLoggedOut(offset, limit);
    }

    const last = stories.length < limit;

    // create a data object
    return { 
      data: {
        stories: stories,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { stories: null, error: error }
  }
}

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
    query = query.trim();

    // refine the query: make the query to match containing, starting or ending with the query
    query = query.split(' ').map((q) => `${q}:*`).join(' | ');

    // add query to back to the req data
    const queryOptions = {
      user: user,
      query: query,
      offset: offset,
      limit: limit,
    }
    
    // build the query(vector search)
    const replies = await Reply.search(queryOptions);

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


// Export all queries as a single object
module.exports = {
  findStoriesByQuery, findRepliesByQuery,
  findTrendingStories, findTrendingReplies
};