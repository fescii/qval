// Import models
const { Sequelize, sequelize, Story, User, Reply } = require('../../models').models;


// Map story fields(sections) to html
const mapFields = (content, data) => {
  let html = /*html*/`
    <div class="intro">
      ${content}
    </div>
  `;
  
  if (data.length <= 0) {
    return html;
  }
  else {
    const sections =  data.map(section => {
      const title = section.title !== null ? `<h2 class="title">${section.title}</h2>` : '';
      return /*html*/`
        <div class="section" order="${section.order}" id="section${section.order}">
          ${title}
          ${section.content}
        </div>
      `
    }).join('');

    return `${html} ${sections}`;
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
        [sequelize.literal(`SELECT COUNT(id) FROM story.views WHERE views.target = stories.hash AND views.createdAt > ${thirtyDaysAgo.toISOString()}`), 'views_last_30_days']
      ],
      group: [
        'stories.kind', 'stories.author', 'stories.hash', 'stories.title', 'stories.content', 
        'stories.slug', 'stories.topics', 'stories.poll', 'stories.votes', 'stories.views', 
        'stories.replies', 'stories.likes', 'stories.end', 'stories.createdAt', 'stories.updatedAt',
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['createdAt', 'DESC']
        ['replies', 'DESC'],
      ],
      include: [
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

    // Check if the stories exist
    if (stories.length < 1) {
      return [];
    }

    // return the stories: map the stories' dataValues
    return  stories.map(story => {
      const data = story.dataValues;
      data.story_author = story.story_author.dataValues;
      data.you = user === data.author;
      // add story sections to the story
      if (story.kind === 'story') {
        data.story_sections = mapFields(data.content, story.story_sections);
      }

      return data;
    });
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function trendingStoriesWhenLoggedOut
 * @description Query to finding trending stories when logged out: using views in the last 30 days
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The stories object or null, and the error if any
*/
const trendingStoriesWhenLoggedOut = async (offset, limit) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const stories = await Story.findAll({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes', 'end', 'createdAt', 'updatedAt',
        [sequelize.literal(`SELECT COUNT(id) FROM story.views WHERE views.target = stories.hash AND views.createdAt > ${thirtyDaysAgo.toISOString()}`), 'views_last_30_days']
      ],
      group: [
        'stories.kind', 'stories.author', 'stories.hash', 'stories.title', 'stories.content', 
        'stories.slug', 'stories.topics', 'stories.poll', 'stories.votes', 'stories.views', 
        'stories.replies', 'stories.likes', 'stories.end', 'stories.createdAt', 'stories.updatedAt'
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['createdAt', 'DESC']
        ['replies', 'DESC'],
      ],
      include: [
        {
          model: User,
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email']
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

    // Check if the stories exist
    if (stories.length < 1) {
      return [];
    }

    // return the stories: map the stories' dataValues
    return  stories.map(story => {
      const data = story.dataValues;
      data.you = false;
      data.story_author = story.story_author.dataValues;
      // add story sections to the story
      if (story.kind === 'story') {
        data.story_sections = mapFields(data.content, story.story_sections);
      }

      return data;
    });
  }
  catch (error) {
    throw error;
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
      attributes: ['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email',
        // Check if the user has liked the reply
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM reply.likes WHERE likes.reply = replies.hash AND likes.author = '${user}')`)),
          'liked'
        ],
        [sequelize.literal(`SELECT COUNT(id) FROM story.views WHERE views.target = replies.hash AND views.createdAt > ${thirtyDaysAgo.toISOString()}`), 'views_last_30_days']
      ],
      group: [
        'replies.hash', 'replies.bio', 'replies.name', 'replies.picture', 'replies.followers', 'replies.following', 
        'replies.stories', 'replies.verified', 'replies.replies', 'replies.email'
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['createdAt', 'DESC']
        ['replies', 'DESC'],
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
      data.reply_story = reply.reply_story.dataValues;
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
      attributes: ['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email',
        [sequelize.literal(`SELECT COUNT(id) FROM story.views WHERE views.target = replies.hash AND views.createdAt > ${thirtyDaysAgo.toISOString()}`), 'views_last_30_days']
      ],
      group: [
        'replies.hash', 'replies.bio', 'replies.name', 'replies.picture', 'replies.followers', 'replies.following', 
        'replies.stories', 'replies.verified', 'replies.replies', 'replies.email'
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['createdAt', 'DESC']
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
      data.reply_story = reply.reply_story.dataValues;
      return data;
    });
  }
  catch (error) {
    throw error;
  }
}

// Export all queries as a single object
module.exports = {
  trendingStoriesWhenLoggedIn, trendingStoriesWhenLoggedOut, trendingRepliesWhenLoggedIn, trendingRepliesWhenLoggedOut
};