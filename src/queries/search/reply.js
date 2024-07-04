// Import models
const { Sequelize, sequelize, User, Reply } = require('../../models').models;

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
    const replies = await Reply.findAll({
      attributes: ['kind', 'author', 'story', 'reply', 'hash', 'content', 'views', 'likes', 'replies', 'createdAt', 'updatedAt',
        // Check if the user has liked the reply
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM story.likes WHERE likes.reply = replies.hash AND likes.author = '${user}')`)),
          'liked'
        ],
        [sequelize.literal(`(SELECT COUNT(*) FROM story.views WHERE views.target = replies.hash AND views."createdAt" > '${thirtyDaysAgo.toISOString()}')`), 'views_last_30_days']
      ],
      group: [ "replies.id", "replies.kind", "replies.author", "replies.story", "replies.reply", "replies.hash",
        "replies.content", "replies.views", "replies.likes", "replies.replies", "replies.createdAt", "replies.updatedAt",
        "reply_author.id", "reply_author.hash", "reply_author.bio", "reply_author.name", "reply_author.picture",
        "reply_author.followers", "reply_author.following", "reply_author.stories", "reply_author.verified", "reply_author.replies",
        "reply_author.email"
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['replies', 'DESC'],
        ['likes', 'DESC'],
        ['createdAt', 'DESC'],
      ],
      include: [
        {
          model: User,
          as: 'reply_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email',
            [
              Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = reply_author.hash AND connects.from = '${user}')`)),
              'is_following'
            ]
          ],
        },
      ],
      limit: limit,
      offset: offset,
      subQuery: false
    });

    // Check if the replies exist
    if (replies.length < 1) {
      return [];
    }

    // return the replies: map the replies' dataValues
    return  replies.map(reply => {
      const data = reply.dataValues;
      data.reply_author = reply.reply_author.dataValues;
      data.you = user === data.author;
      return data;
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
    const replies = await Reply.findAll({
      attributes: ['kind', 'author', 'story', 'reply', 'hash', 'content', 'views', 'likes', 'replies', 'createdAt', 'updatedAt',
        [sequelize.literal(`(SELECT COUNT(*) FROM story.views WHERE views.target = replies.hash AND views."createdAt" > '${thirtyDaysAgo.toISOString()}')`), 'views_last_30_days']
      ],
      group: [ "replies.id", "replies.kind", "replies.author", "replies.story", "replies.reply", "replies.hash",
        "replies.content", "replies.views", "replies.likes", "replies.replies", "replies.createdAt", "replies.updatedAt",
        "reply_author.id", "reply_author.hash", "reply_author.bio", "reply_author.name", "reply_author.picture",
        "reply_author.followers", "reply_author.following", "reply_author.stories", "reply_author.verified", "reply_author.replies",
        "reply_author.email"
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['createdAt', 'DESC'],
        ['replies', 'DESC'],
      ],
      include: [
        {
          model: User,
          as: 'reply_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email']
        },
      ],
      limit: limit,
      offset: offset,
      subQuery: false
    });

    // Check if the replies exist
    if (replies.length < 1) {
      return [];
    }

    // return the replies: map the replies' dataValues
    return  replies.map(reply => {
      const data = reply.dataValues;
      data.you = false;
      data.reply_author = reply.reply_author.dataValues;
      return data;
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