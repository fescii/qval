const { User, sequelize, Sequelize, Connect, View } = require('../../models').models;

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

    users = users.map(user => {
      const data = user.dataValues;
      data.you = user.hash === user;

      return data;
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
    return await User.findAll({
      attributes: [
        'hash', 'name', 'email', 'bio', 'picture', 'followers', 'following', 'stories', 'replies', 'verified',
        [sequelize.fn('COALESCE', sequelize.fn('COUNT', sequelize.col('authored_views.id')), 0), 'views_last_30_days'],
        [sequelize.literal(`CASE WHEN COUNT(user_followers.id) > 0 THEN TRUE ELSE FALSE END`), 'is_following']
      ],
      group: [
        'users.id', 'users.hash', 'users.name', 'users.email', 'users.bio', 'users.picture', 
        'users.followers', 'users.following', 'users.stories', 'users.replies', 'users.verified'
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['followers', 'DESC'],
        ['stories', 'DESC'],
        ['replies', 'DESC'],
      ],
      include: [
        {
          model: View,
          as: 'authored_views',
          attributes: [],
          where: {
            createdAt: {
              [Sequelize.Op.gt]: thirtyDaysAgo
            }
          },
          required: false
        },
        {
          model: Connect,
          as: 'user_followers',
          attributes: [],
          where: {
            from: user
          },
          required: false
        }
      ],
      limit: limit,
      offset: offset,
      subQuery: false
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
    return await User.findAll({
      attributes: [
        'hash', 'name', 'email', 'bio', 'picture', 'followers', 'following', 'stories', 'replies', 'verified',
        [sequelize.fn('COALESCE', sequelize.fn('COUNT', sequelize.col('authored_views.id')), 0), 'views_last_30_days']
      ],
      group: [
        'users.id', 'users.hash', 'users.name', 'users.email', 'users.bio', 'users.picture', 
        'users.followers', 'users.following', 'users.stories', 'users.replies', 'users.verified'
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['followers', 'DESC'],
        ['stories', 'DESC'],
        ['replies', 'DESC'],
      ],
      include: [
        {
          model: View,
          as: 'authored_views',
          attributes: [],
          where: {
            createdAt: {
              [Sequelize.Op.gt]: thirtyDaysAgo
            }
          },
          required: false
        }
      ],
      limit: limit,
      offset: offset,
      subQuery: false
    });
  }
  catch (error) {
    throw error;
  }
};

module.exports = {
  findTrendingUsers, findUsersByQuery
}