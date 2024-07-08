// Import user and sequelize from models
const { User, sequelize} = require('../../models').models;
const { topUsersLoggedIn, topUsersLoggedOut} = require('../raw').user;

/**
 * @function getRecommendedUsers
 * @description A query function to get the top 5 recommended users based on the following criteria:
 * 1. Users who have the most followers
 * 2. Users with the most content views in the past 30 days
 * 3. If a user has both the most followers and the most content views, they should be ranked higher
 * 4. If the user requesting the data is following a recommended user, that user should not be included in the results unless the results are less than 5
 * 5. Or if the ruquesting user(hash) is null, fetch the top 5 users dont check if the requesting user is following them
 * @param {String} hash - The hash of the user requesting the data
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const getRecommendedUsers = async hash => {
  try {
    // check if the requesting user is null
    if (!hash) {
      // get the top 5 recommended users when the user is not logged in
      const users = await getRecommendedUsersWhenNotLoggedIn();

      // Return the results
      return { people: users, error: null };
    }
    else {
      // get the top 5 recommended users when the user is logged in
      const users = await getRecommendedUsersWhenLoggedIn(hash);
      

      // map users to check if user is the current user
      const usersMap = users.map(user => {
        user.you = user.hash === hash;

        return user;
      });

      // Return the results
      return { people: usersMap, error: null };
    }

  }
  catch (error) {
    return { people: null, error };
  }
};



/**
 * @function getRecommendedUsersWhenLoggedIn
 * @description A query function to get the top 5 recommended users based on the following criteria:
 * 1. Users who have the most followers
 * 2. Users with the most content views in the past 30 days
 * 3. If a user has both the most followers and the most content views, they should be ranked higher
 * @param {String} hash - The hash of the user requesting the data
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const getRecommendedUsersWhenLoggedIn = async hash => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    // Define the query to get the top 5 recommended users
    return await sequelize.query(topUsersLoggedIn, {
      replacements: { 
        user: hash,
        daysAgo: thirtyDaysAgo.toISOString()
      },
      type: sequelize.QueryTypes.SELECT
    });
  }
  catch (error) {
    throw error;
  }
};

/**
 * @function getRecommendedUsersWhenNotLoggedIn
 * @description A query function to get the top 5 recommended users based on the following criteria:
 * 1. Users who have the most followers
 * 2. Users with the most content views in the past 30 days
 * 3. If a user has both the most followers and the most content views, they should be ranked higher
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const getRecommendedUsersWhenNotLoggedIn = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    // Define the query to get the top 5 recommended users
    return await sequelize.query(topUsersLoggedOut, {
      replacements: { 
        daysAgo: thirtyDaysAgo.toISOString()
      },
      type: sequelize.QueryTypes.SELECT
    });
  }
  catch (error) {
    throw error;
  }
};

// Export the function
module.exports = {
  getRecommendedUsers
}
