const { sequelize, Sequelize, Like, User } = require('../../models').models;
const Op = Sequelize.Op;


/**
 * @function getLikesWhenLoggedIn
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Promise<Object>} - The story likes
*/
const getLikesWhenLoggedIn = async (where, order, limit, offset) => {
  try {
    const likes =  await Like.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'reply_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified',
            [
              Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = reply_author.hash AND connects.from = '${user}')`)),
              'is_following'
            ]
          ],
        }
      ],
    });

    return data = likes.map(like => {
      return {
        ...like.dataValues,
        reply_author: like.reply_author.dataValues
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
    const likes =  await Like.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'reply_author',
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