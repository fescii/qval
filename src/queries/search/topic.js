// Import models
const { Sequelize, sequelize, User, Topic, TopicSection } = require('../../models').models;

/**
 * @function findTopicsByQuery
 * @description Query to finding topics by query: using vector search
 * @param {Object} reqData - The request data
 * @returns {Object} - The topics object or null, and the error if any
*/
const findTopicsByQuery = async reqData => {
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
    let topics = await Topic.search(queryOptions);

    // if topics is empty, return an empty array
    if (topics.length < 1) {
      return { 
        data: {
          topics: [],
          limit: limit,
          offset: offset,
          last: true,
        },
        error: null 
      }
    }

    const last = topics.length < limit;

    topics = topics.map(topic => {
      const data = topic.dataValues;
      data.you = user === data.author;
      return data;
    })

    // create a data object
    return { 
      data: {
        topics: topics,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { topics: null, error: error }
  }
}

/**
 * @function findTrendingTopics
 * @description Query to finding trending topics: using views and likes in the last 30 days
 * @param {Object} reqData - The request data
 * @returns {Object} - The topics object or null, and the error if any
*/
const findTrendingTopics = async reqData => {
  try {
    const {
      user, page, limit
    } = reqData;

    // calculate the offset
    const offset = (page - 1) * limit;
    
    let topics = null;

    // check if the user is logged in
    if (user) {
      topics = await trendingTopicsWhenLoggedIn(user, offset, limit);
    }
    else {
      topics = await trendingTopicsWhenLoggedOut(offset, limit);
    }

    const last = topics.length < limit;

    // create a data object
    return { 
      data: {
        topics: topics,
        limit: limit,
        offset: offset,
        last: last,
      },
     error: null 
    }
  }
  catch (error) {
    return { topics: null, error: error }
  }
}

/**
 * @function trendingTopicsWhenLoggedIn
 * @description Query to finding trending topics when logged in: using views in the last 30 days
 * @param {String} user - The user hash
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The topics object or null, and the error if any
*/
const trendingTopicsWhenLoggedIn = async (user, offset, limit) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const topics = await Topic.findAll({
      attributes: ['author', 'hash', 'name', 'slug', 'summary', 'followers', 'subscribers', 'stories', 'views',
        // Check if the user has followed the topic
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM "topic"."followers" AS t_followers WHERE t_followers.topic = topics.hash AND t_followers.author = '${user}')`)),
          'is_following'
        ],
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM "topic"."subscribers" AS t_subscribers WHERE t_subscribers.topic = topics.hash AND t_subscribers.author = '${user}')`)),
          'is_subscribed'
        ],
        [sequelize.literal(`(SELECT COUNT(*) FROM story.views WHERE views.target = topics.hash AND views."createdAt" > '${thirtyDaysAgo.toISOString()}')`), 'views_last_30_days']
      ],
      include: [
        {
          model: User,
          as: 'topic_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email',
            [
              Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = topic_author.hash AND connects.from = '${user}')`)),
              'is_following'
            ]
          ],
        },
        // Include the topic sections
        {
          model: TopicSection,
          as: 'topic_sections',
          attributes: ['id', 'content', 'order', 'id', 'title', 'content'],
          order: [['order', 'ASC']]
        }
      ],
      group: [ "topics.id", "topics.author", "topics.hash", "topics.name", "topics.slug", "topics.summary",
        "topics.followers", "topics.subscribers", "topics.stories", "topics.views", "topic_author.id", "topic_author.hash", 
        "topic_author.bio", "topic_author.name", "topic_author.picture", "topic_author.followers", "topic_author.following",
        "topic_author.stories", "topic_author.verified", "topic_author.replies", "topic_author.email", "topic_sections.id", 
        "topic_sections.content", "topic_sections.order", "topic_sections.id", "topic_sections.title"
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['followers', 'DESC'],
        ['stories', 'DESC'],
        ['createdAt', 'DESC'],
      ],
      limit: limit,
      offset: offset,
      subQuery: false
    });

    // Check if the topics exist
    if (topics.length < 1) {
      return [];
    }

    // return the topics: map the topics' dataValues
    return  topics.map(topic => {
      const data = topic.dataValues;
      data.you = user === data.author;
      return data;
    });
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function trendingTopicsWhenLoggedOut
 * @description Query to finding trending topics when logged out: using views in the last 30 days
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The topics object or null, and the error if any
*/
const trendingTopicsWhenLoggedOut = async (offset, limit) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const topics = await Topic.findAll({
      attributes: ['author', 'hash', 'name', 'slug', 'summary', 'followers', 'subscribers', 'stories', 'views',
        [sequelize.literal(`(SELECT COUNT(*) FROM story.views WHERE views.target = topics.hash AND views."createdAt" > '${thirtyDaysAgo.toISOString()}')`), 'views_last_30_days']
      ],
      include: [
        {
          model: User,
          as: 'topic_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email'],
        },
        // Include the topic sections
        {
          model: TopicSection,
          as: 'topic_sections',
          attributes: ['id', 'content', 'order', 'id', 'title', 'content'],
          order: [['order', 'ASC']]
        }
      ],
      group: [ "topics.id", "topics.author", "topics.hash", "topics.name", "topics.slug", "topics.summary",
        "topics.followers", "topics.subscribers", "topics.stories", "topics.views", "topic_author.id", "topic_author.hash", 
        "topic_author.bio", "topic_author.name", "topic_author.picture", "topic_author.followers", "topic_author.following",
        "topic_author.stories", "topic_author.verified", "topic_author.replies", "topic_author.email", "topic_sections.id", 
        "topic_sections.content", "topic_sections.order", "topic_sections.id", "topic_sections.title"
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['followers', 'DESC'],
        ['stories', 'DESC'],
        ['createdAt', 'DESC'],
      ],
      limit: limit,
      offset: offset,
      subQuery: false
    });

    // Check if the topics exist
    if (topics.length < 1) {
      return [];
    }

    // return the topics: map the topics' dataValues
    return  topics.map(topic => {
      const data = topic.dataValues;
      data.you = false;
      return data;
    });
  }
  catch (error) {
    throw error;
  }
}

// Export all queries as a single object
module.exports = {
  findTopicsByQuery, findTrendingTopics
};