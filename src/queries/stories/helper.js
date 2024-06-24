// Importing the required modules, fns, configs, and utils...
const { sequelize, Sequelize, Story, User } = require('../../models').models;
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
              sequelize.literal(`(
              SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
              FROM account.connects
              WHERE connects.to = story_author.hash
              AND connects.from = '${user}'
              )`),
              'is_following'
            ]
          ],
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
 * @function getStoriesWhenLoggedIn
 * @description a function that queries stories when user is logged in
 * @param {Object} where - The where condition for the query: the where object
 * @param {Array} order - The order for the query: the order array
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
        }
      ]
    });

    // Check if the stories exist
    if (!stories) {
      return { stories: null, error: null };
    }

    // return the stories: map the stories' dataValues
    return { 
      stories: stories.map(story => story.dataValues),
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
      stories: stories.map(story => story.dataValues),
      error: null 
    };
  }
  catch (error) {
    // return the error
    return { stories: null, error };
  }
}


// Export the module
module.exports = {
  findStoryWhenLoggedIn, findStoryWhenLoggedOut, getStoriesWhenLoggedIn, getStoriesWhenLoggedOut
};