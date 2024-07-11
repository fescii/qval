// Import models
const { Sequelize, sequelize, User, Topic, TopicSection } = require('../../models').models;
const { topTopicsLoggedIn, topTopicsLoggedOut } = require('../raw').topic;
/**
 * @function findTopicsByQuery
 * @description Query to finding topics by query: using vector search
 * @param {Object} reqData - The request data
 * @returns {Object} - The topics object or null, and the error if any
*/
const findTopicsByQuery = async reqData => {
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
    let topics = await Topic.search(queryOptions);

    // if topics is empty, return an empty array
    if (topics.length < 1) {
      return { 
        data: {
          topics: [],
          limit: limit,
          offset: offset,
          last: true,
        },
        error: null 
      }
    }

    const last = topics.length < limit;

    topics = topics.map(topic => {
      topic.you = user === topic.author;
      return topic;
    })

    // create a data object
    return { 
      data: {
        topics: topics,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { topics: null, error: error }
  }
}

/**
 * @function findTrendingTopics
 * @description Query to finding trending topics: using views and likes in the last 30 days
 * @param {Object} reqData - The request data
 * @returns {Object} - The topics object or null, and the error if any
*/
const findTrendingTopics = async reqData => {
  try {
    const {
      user, page, limit
    } = reqData;

    // calculate the offset
    const offset = (page - 1) * limit;
    
    let topics = null;

    // check if the user is logged in
    if (user) {
      topics = await trendingTopicsWhenLoggedIn(user, offset, limit);
    }
    else {
      topics = await trendingTopicsWhenLoggedOut(offset, limit);
    }

    const last = topics.length < limit;

    // create a data object
    return { 
      data: {
        topics: topics,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { topics: null, error: error }
  }
}

/**
 * @function trendingTopicsWhenLoggedIn
 * @description Query to finding trending topics when logged in: using views in the last 30 days
 * @param {String} user - The user hash
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The topics object or null, and the error if any
*/
const trendingTopicsWhenLoggedIn = async (user, offset, limit) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const topics = await sequelize.query(topTopicsLoggedIn, {
      replacements: { 
        user, 
        daysAgo: thirtyDaysAgo.toISOString(), 
        offset, 
        limit 
      },
      type: Sequelize.QueryTypes.SELECT
    });

    // Check if the topics exist
    if (topics.length < 1) {
      return [];
    }

    // return the topics: map the topics' dataValues
    return  topics.map(topic => {
      topic.you = user === topic.author;
      return topic;
    });
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function trendingTopicsWhenLoggedOut
 * @description Query to finding trending topics when logged out: using views in the last 30 days
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The topics object or null, and the error if any
*/
const trendingTopicsWhenLoggedOut = async (offset, limit) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const topics = await sequelize.query(topTopicsLoggedOut, {
      replacements: { 
        daysAgo: thirtyDaysAgo.toISOString(), 
        offset, 
        limit 
      },
      type: Sequelize.QueryTypes.SELECT
    });

    // Check if the topics exist
    if (topics.length < 1) {
      return [];
    }

    // return the topics: map the topics' dataValues
    return topics.map(topic => {
      topic.you = false;
      return topic;
    });
  }
  catch (error) {
    throw error;
  }
}

// Export all queries as a single object
module.exports = {
  findTopicsByQuery, findTrendingTopics
};