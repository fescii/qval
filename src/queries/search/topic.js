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
    const topics = await Topic.search(queryOptions);

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


const mapTopicFields = (data, hash) => {
  if (data.length <= 0) {
    return html = /*html*/`
      <div class="empty">
        <p>The topic has no information yet. You can contribute to this topic by adding relevent information about the topic.</p>
        <a href="/t/${hash}/contribute" class="button">Contribute</a>
      </div>
    `;
  }
  else {
    const html = data.map(section => {
      const title = section.title !== null ? `<h2 class="title">${section.title}</h2>` : '';
      return /*html*/`
        <div class="section" order="${section.order}" id="section${section.order}">
          ${title}
          ${section.content}
        </div>
      `
    }).join('');

    const last = /*html*/`
      <div class="last">
        <p>Do you have more information about this topic? You can contribute to this topic by adding or editing information.</p>
        <a href="/t/${hash}/contribute" class="button">Contribute</a>
      </div>
    `

    return html + last;
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
      // add the topic sections to the data object
      topic.topic_sections = mapTopicFields(topic.topic_sections, topic.hash);
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
      group: [ "topics.id", "topics.author", "topics.hash", "topics.name", "topics.slug", "topics.summary",
        "topics.followers", "topics.subscribers", "topics.stories", "topics.views", "topic_author.id", "topic_author.hash", 
        "topic_author.bio", "topic_author.name", "topic_author.picture", "topic_author.followers", "topic_author.following",
        "topic_author.stories", "topic_author.verified", "topic_author.replies", "topic_author.email", "topic_sections.kind", 
        "topic_sections.content", "topic_sections.order", "topic_sections.id", "topic_sections.title"
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['followers', 'DESC'],
        ['stories', 'DESC'],
        ['createdAt', 'DESC'],
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
          attributes: ['kind', 'content', 'order', 'id', 'title', 'content'],
          order: [['order', 'ASC']]
        }
      ],
      limit: limit,
      offset: offset,
    });

    // Check if the topics exist
    if (topics.length < 1) {
      return [];
    }

    // return the topics: map the topics' dataValues
    return  topics.map(topic => {
      const data = topic.dataValues;
      // add the topic sections to the data object
      topic.topic_sections = mapTopicFields(topic.topic_sections, topic.hash);
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