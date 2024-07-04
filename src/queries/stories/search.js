// Import models
const { Sequelize, sequelize, Story, User, Reply, View } = require('../../models').models;

/**
 * @function findStoriesByQuery
 * @description Query to finding story by query: using vector search 
 * @param {Object} reqData - The request data
 * @returns {Object} - The stories object or null, and the error if any
*/
const findStoriesByQuery = async (reqData) => {
  try {
    const {
      query, user, page, limit
    } = reqData;

    // calculate the offset
    const offset = page * limit;

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
    const stories = await Story.search(queryOptions);

    const last = stories.length < limit;

    // create a data object
    return { 
      data: {
        stories: stories,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { stories: null, error: error }
  }
}

/**
 * @function findTrendingStories
 * @description Query to finding trending stories: using views and likes in the last 30 days
 * @param {Object} reqData - The request data
 * @returns {Object} - The stories object or null, and the error if any
*/
const findTrendingStories = async (reqData) => {
  try {
    const {
      user, page, limit
    } = reqData;

    // calculate the offset
    const offset = page * limit;

    // add query to back to the req data
    const queryOptions = {
      user: user,
      offset: offset,
      limit: limit,
    }
    
    // build the query(vector search)
    const stories = await Story.trending(queryOptions);

    const last = stories.length < limit;

    // create a data object
    return { 
      data: {
        stories: stories,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { stories: null, error: error }
  }
}


/**
 * @function findRepliesByQuery
 * @description Query to finding replies by query: using vector search
 * @param {Object} reqData - The request data
 * @returns {Object} - The replies object or null, and the error if any
*/
const findRepliesByQuery = async (reqData) => {
  try {
    const {
      query, user, page, limit
    } = reqData;

    // calculate the offset
    const offset = page * limit;

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
 * @function trendingStoriesWhenLoggedIn
 * @description Query to finding trending stories when logged in: using views and likes in the last 30 days
 * @param {String} user - The user hash
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The stories object or null, and the error if any
*/

const trendingStoriesWhenLoggedIn = async (user, offset, limit) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const stories = await Story.findAll({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes', 'end', 'createdAt', 'updatedAt',
        // Check if the user has liked the story
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM story.likes WHERE likes.story = stories.hash AND likes.author = '${user}')`)),
          'liked'
        ],
        [
          Sequelize.literal(`(SELECT option FROM story.votes WHERE votes.author = '${user}' AND votes.story = stories.hash LIMIT 1)`),
          'option'
        ],
        [sequelize.fn('COALESCE', sequelize.fn('COUNT', sequelize.col('story_views.id')), 0), 'views_last_30_days']
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['createdAt', 'DESC']
        ['replies', 'DESC'],
      ],
      include: [
        {
          model: View,
          as: 'story_views',
          attributes: [],
          where: {
            createdAt: {
              [Sequelize.Op.gt]: thirtyDaysAgo
            }
          },
          required: false
        },
        {
          model: User,
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email',
            [
              Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = story_author.hash AND connects.from = '${user}')`)),
              'is_following'
            ]
          ],
        },
        // Include the story sections
        {
          model: StorySection,
          as: 'story_sections',
          attributes: ['kind', 'content', 'order', 'id', 'title', 'content'],
          order: [['order', 'ASC']]
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
}


// Export all queries as a single object
module.exports = {
  findStoriesByQuery, findRepliesByQuery
};