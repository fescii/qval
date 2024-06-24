// Importing the required modules, fns, configs, and utils...
const { sequelize, Sequelize, Story, Reply, User, Vote } = require('../../models').models;
const Op = Sequelize.Op;


/**
 * @function findStoryWhenLoggedIn
 * @description Query to find a topic by slug or hash when user is logged in
 * @param {String} query - The query of the topic
 * @param {String} user - The user hash
 * @returns {Object} - The topic object or null, and the error if any
*/
const findStoryWhenLoggedIn = async (query, user) => {
  try {
    // Find the story
    const story = await Story.findOne({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes',
        // Check if the user has liked the story
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(
            SELECT 1 FROM story.likes WHERE likes.target = stories.hash AND likes.author = '${user}'
          )`)),
          'liked'
        ]
      ],
      where: {
        published: true,
        [Op.or]: [{ slug: query }, { hash: query.toUpperCase() }]
      },
      include: [
        {
          model: User,
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified',
            [
              sequelize.fn('EXISTS', sequelize.literal(`(
                SELECT 1 FROM account.connects WHERE connects.to = story_author.hash AND connects.from = '${user}'
              )`)),
              'is_following'
            ]
          ],
        },
        // If story kind is poll, include user vote: if and only if the kind is poll
        {
          model: Vote,
          as: 'story_votes',
          attributes: ['option'],
          where: { author: user, story: sequelize.col('stories.hash')},
          limit : 1,
          required: false
        }
      ]
    });

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    // return the story
    const data = story.dataValues;

    // add you you to the story
    data.you = user === data.author;

    // add authenicated to the story
    data.authenticated = true;

    // return the story
    return { 
      story: data,
      error: null 
    };
  } 
  catch (error) {
    // return the error
    return { story: null, error: error };
  }
};

/**
 * function findStoryWhenLoggedOut
 * @description Query to find a topic by slug or hash when user is logged out
 * @param {String} query - The query of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const findStoryWhenLoggedOut = async query => {
  try {
    // Find the story
    const story = await Story.findOne({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes'],
      where: {
        published: true,
        [Op.or]: [{ slug: query }, { hash: query.toUpperCase() }]
      },
      include: [
        {
          model: User,
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified']
        }
      ]
    });

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    const data = story.dataValues;

    // add you you to the story
    data.you = false;

    // add authenicated to the story
    data.authenticated = false;

    // return the story
    return { 
      story: data,
      error: null 
    };
  } 
  catch (error) {
    // return the error
    return { story: null, error: error };
  }
};

/**
 * @function findReplyWhenLoggedIn
 * @description a function that queries replies when user is logged in
 * @param {String} hash - The hash of the reply
 * @param {String} user - The hash of the user
 * @returns {Object} data - The reply object and error if any
*/
const findReplyWhenLoggedIn = async (hash, user) => {
  try {
    // Find the reply
    const reply = await Reply.findOne({
      attributes : ['kind', 'author', 'parent', 'hash', 'content', 'views', 'likes', 'replies',
        // Check if the user has liked the reply
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(
            SELECT 1 FROM reply.likes WHERE likes.target = replies.hash AND likes.author = '${user}'
          )`)),
          'liked'
        ]
      ],
      where: { hash },
      include: [
        {
          model: User,
          as: 'reply_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified',
            [
              Sequelize.fn('EXISTS', Sequelize.literal(`( 
                SELECT 1 FROM account.connects WHERE connects.to = reply_author.hash AND connects.from = '${user}'
              )`)),
              'is_following'
            ]
          ],
        }
      ],
    });

    // Check if the reply exists
    if (!reply) {
      return { reply: null, error: null };
    }

    // return the reply
    const data = reply.dataValues;

    // add you you to the reply
    data.you = user === data.author;

    // add authenicated to the reply
    data.authenticated = true;

    // return the reply
    return { 
      reply: data,
      error: null 
    };
  }
  catch (error) {
    // return the error
    return { reply: null, error };
  }
}

/**
 * @function findReplyWhenLoggedOut
 * @description a function that queries replies when user is logged out
 * @param {String} hash - The hash of the reply
 * @returns {Object} data - The reply object and error if any
*/
const findReplyWhenLoggedOut = async hash => {
  try {
    // Find the reply
    const reply = await Reply.findOne({
      attributes : ['kind', 'author', 'parent', 'hash', 'content', 'views', 'likes', 'replies'],
      where: { hash },
      include: [
        {
          model: User,
          as: 'reply_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified'],
        }
      ],
    });

    // Check if the reply exists
    if (!reply) {
      return { reply: null, error: null };
    }

    // return the reply
    const data = reply.dataValues;

    // add you you to the reply
    data.you = false;

    // add authenicated to the reply
    data.authenticated = false;

    // return the reply
    return { 
      reply: data,
      error: null 
    };
  }
  catch (error) {
    // return the error
    return { reply: null, error };
  }
}

/**
 * @function getStoriesWhenLoggedIn
 * @description a function that queries stories when user is logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {String} user - The user hash
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The stories object and error if any
*/
const getStoriesWhenLoggedIn = async (where, order, user, limit, offset) => {
  try {
    // Find the stories
    const stories = await Story.findAll({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes',
        // Check if the user has liked the story
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(
            SELECT 1 FROM story.likes WHERE likes.target = stories.hash AND likes.author = '${user}'
          )`)),
          'liked'
        ]
      ],
      where: where,
      order: [order],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified',
            [
              Sequelize.fn('EXISTS', Sequelize.literal(`( 
                SELECT 1 FROM account.connects WHERE connects.to = story_author.hash AND connects.from = '${user}'
              )`)),
              'is_following'
            ]
          ],
        },
        // If story kind is poll, include user vote: if and only if the kind is poll
        {
          model: Vote,
          as: 'story_votes',
          attributes: ['option'],
          where: { author: user, story: sequelize.col('stories.hash')},
          limit : 1,
          required: false
        }
      ]
    });

    // Check if the stories exist
    if (!stories) {
      return { stories: null, error: null };
    }

    // return the stories: map the stories' dataValues
    return { 
      stories: stories.map(story => {
        const data = story.dataValues;
        data.you = user === data.author;
        data.authenticated = true;

        return data;
      }),
      error: null 
    };
  }
  catch (error) {
    // return the error
    return { stories: null, error };
  }
}

/**
 * @function getStoriesWhenLoggedOut
 * @description a function that queries stories when user is logged out
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The stories object and error if any
*/
const getStoriesWhenLoggedOut = async (where, order, limit, offset) => {
  try {
    // Find the stories
    const stories = await Story.findAll({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes'],
      where: where,
      order: [order],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified']
        }
      ]
    });

    // Check if the stories exist
    if (!stories) {
      return { stories: null, error: null };
    }

    // return the stories: map the stories' dataValues
    return { 
      stories: stories.map(story => {
        const data = story.dataValues;
        data.you = false;
        data.authenticated = false;

        return data;
      }),
      error: null 
    };
  }
  catch (error) {
    // return the error
    return { stories: null, error };
  }
}

/**
 * @function getRepliesWhenLoggedIn
 * @description a function that queries replies when user is logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The replies object and error if any
*/
const getRepliesWhenLoggedIn = async (where, order, user, limit, offset) => {
  try {
    // Find the replies
    const replies = await Reply.findAll({
      attributes : ['kind', 'author', 'parent', 'hash', 'content', 'views', 'likes', 'replies',
        // Check if the user has liked the reply
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(
            SELECT 1 FROM reply.likes WHERE likes.target = replies.hash AND likes.author = '${user}'
          )`)),
          'liked'
        ]
      ],
      where: where,
      order: [order],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          as: 'reply_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified',
            [
              Sequelize.fn('EXISTS', Sequelize.literal(`( 
                SELECT 1 FROM account.connects WHERE connects.to = reply_author.hash AND connects.from = '${user}'
              )`)),
              'is_following'
            ]
          ],
        }
      ],
    });

    // Check if the replies exist
    if (!replies) {
      return { replies: null, error: null };
    }

    // return the replies
    return { 
      replies: replies.map(reply => {
        const data = reply.dataValues;
        data.you = user === data.author;
        data.authenticated = true;

        return data;
      }),
      error: null 
    };
  }
  catch (error) {
    // return the error
    return { replies: null, error };
  }
}

/**
 * @function getRepliesWhenLoggedOut
 * @description a function that queries replies when user is logged out
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
 * @param {Number} limit - The limit for pagination
 * @param {Number} offset - The offset for pagination
 * @returns {Object} data - The replies object and error if any
*/
const getRepliesWhenLoggedOut = async (where, order, limit, offset) => {
  try {
    // Find the replies
    const replies = await Reply.findAll({
      attributes : ['kind', 'author', 'parent', 'hash', 'content', 'views', 'likes', 'replies'],
      where: where,
      order: [order],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          as: 'reply_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified'],
        }
      ],
    });

    // Check if the replies exist
    if (!replies) {
      return { replies: null, error: null };
    }

    // return the replies
    return { 
      replies: replies.map(reply => {
        const data = reply.dataValues;
        data.you = false;
        data.authenticated = false;

        return data;
      }),
      error: null 
    };
  }
  catch (error) {
    // return the error
    return { replies: null, error };
  }
}

// Export the module
module.exports = {
  findStoryWhenLoggedIn, findStoryWhenLoggedOut, getStoriesWhenLoggedIn, getStoriesWhenLoggedOut,
  findReplyWhenLoggedIn, findReplyWhenLoggedOut, getRepliesWhenLoggedIn, getRepliesWhenLoggedOut
};