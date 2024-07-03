// Import user and sequelize from models
const { User, sequelize, Sequelize, Connect, View } = require('../../models').models;


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
      // Define the query to get the top 5 recommended users
      const users = await User.findAll({
        attributes: {
          include: ['hash', 'bio', 'name', 'email', 'picture', 'followers', 'following', 'stories', 'verified', 'replies',
            [Sequelize.literal(`(SELECT COUNT(*) FROM story.views WHERE author = users.hash AND createdAt > NOW() - INTERVAL '30 DAY')`), 'views']
          ]
        },
        order: [
          [Sequelize.literal('views'), 'DESC'],
          ['followers', 'DESC'],
          ['stories', 'DESC'],
          ['replies', 'DESC'],
        ],
        limit: 5
      });

      // Return the results
      return { people: users, error: null };
    }
    else {
      // Define the query to get the top 5 recommended users
      // const users = await User.findAll({
      //   attributes: [
      //     'hash', 'bio', 'name', 'email', 'picture', 'followers', 'following', 'stories', 'verified', 'replies',
      //     [Sequelize.fn('COUNT', Sequelize.col('authored_views.id')), 'views'],
      //     [Sequelize.literal(`CASE WHEN user_followers.from IS NOT NULL THEN TRUE ELSE FALSE END`), 'is_following']
      //   ],
      //   include: [
      //     {
      //       model: View,
      //       as: 'authored_views',
      //       attributes: [],
      //       where: {
      //         createdAt: {
      //           [Sequelize.Op.gt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      //         }
      //       },
      //       required: false
      //     },
      //     {
      //       model: Connect,
      //       as: 'user_followers',
      //       attributes: [],
      //       where: {
      //         to: Sequelize.col('users.hash')
      //       },
      //       required: false
      //     }
      //   ],
      //   order: [
      //     [Sequelize.literal('views'), 'DESC'],
      //     ['followers', 'DESC'],
      //     ['stories', 'DESC'],
      //     ['replies', 'DESC'],
      //   ],
      //   limit: 5
      // });

      // user literal query
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const users = await User.findAll({
        attributes: [
          'hash', 'name', 'email', 'bio', 'picture', 'followers', 'following', 'stories', 'replies', 'verified',
          [sequelize.fn('COALESCE', sequelize.fn('COUNT', sequelize.col('authored_views.id')), 0), 'views_last_30_days'],
          [sequelize.literal(`CASE WHEN COUNT(user_followers.id) > 0 THEN TRUE ELSE FALSE END`), 'is_following']
        ],
        group: ['User.id', 'User.hash', 'User.name', 'User.email', 'User.bio', 'User.picture', 
          'User.followers', 'User.following', 'User.stories', 'User.replies', 'User.verified'],
        order: [
          [sequelize.literal('views'), 'DESC'],
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
        ],
        limit: 5
      });

      // console.log('users', users)

      // Return the results
      return { people: users, error: null };
    }

  }
  catch (error) {
    return { people: null, error };
  }
};



// Export the function
module.exports = {
  getRecommendedUsers
}
