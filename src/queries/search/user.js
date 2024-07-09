const { User, sequelize} = require('../../models').models;
const { topUsersLoggedIn, topUsersLoggedOut} = require('../raw').user;
/**
 * @function findUsersByQuery
 * @description Query to finding users by query: using vector search
 * @param {Object} reqData - The request data
 * @returns {Object} - The users object or null, and the error if any
*/
const findUsersByQuery = async reqData => {
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
    let users = await User.search(queryOptions);

    // if no users found, return an empty array
    if (!users) {
      return {
        data: {
          people: [],
          limit: limit,
          offset: offset,
          last: true,
        },
        error: null
      }
    }

    const last = users.length < limit;

    users = users.map(author => {
      author.you = author.hash === user;
      return author;
    })

    // create a data object
    return { 
      data: {
        people: users,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { people: null, error: error }
  }
}

/**
 * @function findTrendingUsers
 * @description Query to finding trending users: using views and likes in the last 30 days
 * @param {Object} reqData - The request data
 * @returns {Object} - The users object or null, and the error if any
*/
const findTrendingUsers = async reqData => {
  try {
    const {
      user, page, limit
    } = reqData;

    // calculate the offset
    const offset = (page - 1) * limit;
    
    let users = null;

    // check if the user is logged in
    if (user) {
      users = await trendingUsersWhenLoggedIn(user, offset, limit);
    }
    else {
      users = await trendingUsersWhenLoggedOut(offset, limit);
    }

    const last = users.length < limit;

    // map the users to the required format
    users = users.map(user => {
      user.you = user.hash === user;
      return user;
    })

    // create a data object
    return { 
      data: {
        people: users,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { people: null, error: error }
  }
}

/**
 * @function trendingUsersWhenLoggedIn
 * @description A query function to get the top trending users
 * 2. Users with the most content views in the past 30 days
 * @param {String} user - The hash of the user requesting the data
 * @param {Number} offset - The offset number
 * @param {Number} limit - The limit number
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const trendingUsersWhenLoggedIn = async (user, offset, limit) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    // Define the query to get the top 5 recommended users
    return await sequelize.query(topUsersLoggedIn, {
      replacements: {
        user: user,
        daysAgo: thirtyDaysAgo.toISOString(),
        offset: offset,
        limit: limit
      },
      type: sequelize.QueryTypes.SELECT
    });
  }
  catch (error) {
    throw error;
  }
};

/**
 * @function trendingUsersWhenLoggedOut
 * @description A query function to get the top trending users based on the following criteria:
 * 2. Users with the most content views in the past 30 days
 * @param {Number} offset - The offset number
 * @param {Number} limit - The limit number
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const trendingUsersWhenLoggedOut = async (offset, limit) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    // Define the query to get the top 5 recommended users
    return await sequelize.query(topUsersLoggedOut, {
      replacements: {
        daysAgo: thirtyDaysAgo.toISOString(),
        offset: offset,
        limit: limit
      },
      type: sequelize.QueryTypes.SELECT
    });
  }
  catch (error) {
    throw error;
  }
};

module.exports = {
  findTrendingUsers, findUsersByQuery
}