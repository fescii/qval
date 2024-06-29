const { Sequelize, Like, User } = require('../../models').models;


/**
 * @function getLikesWhenLoggedIn
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {String} user - The user hash
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Promise<Object>} - The story likes
*/
const getLikesWhenLoggedIn = async (where, order, user, limit, offset) => {
  try {
    const likes =  await Like.findAll({
      attributes: ['author', 'reply', 'story', 'createdAt', 'updatedAt'],
      where,
      order:[order],
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'like_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified',
            [
              Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = like_author.hash AND connects.from = '${user}')`)),
              'is_following'
            ]
          ],
        }
      ],
    });

    return data = likes.map(like => {
      return {
        ...like.dataValues,
        like_author: like.like_author.dataValues
      };
    });
  }
  catch (error) {
    throw error;
  }
};

/**
 * @function getLikesWhenLoggedOut
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Promise<Object>} - The story likes
 * */
const getLikesWhenLoggedOut = async (where, order, limit, offset) => {
  try {
    const likes =  await Like.findAll({
      attributes: ['author', 'reply', 'story', 'createdAt', 'updatedAt'],
      where,
      order:[order],
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'like_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified'],
        }
      ],
    });

    return likes;
  }
  catch (error) {
    throw error;
  }
}

// export the functions
module.exports = {
  getLikesWhenLoggedIn,
  getLikesWhenLoggedOut
};