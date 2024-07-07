// Import models
const { Sequelize, sequelize, Story, StorySection, User, Reply } = require('../../models').models;

/**
 * @function fetchTrending
 * @description Query to finding trending stories and replies
 * @param {String} - hash - The user hash
 * @returns {Object} - The stories object or null, and the error if any
*/
const fetchTrending = async hash => {
  try {
    const data =  hash ? await fetchTrendingWhenLoggedIn(hash) : await fetchTrendingWhenLoggedOut();

    return {
      data,
      error: null
    }
  }
  catch (error) {
    return { data: null, error }
  }
}

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
 * @function fetchTrendingWhenLoggedIn
 * @description Query to finding trending stories an replies when logged in: using views and likes in the last 30 days
 * @param {String} user - The user hash
 * @returns {Object} - The stories object or null, and the error if any
*/
const fetchTrendingWhenLoggedIn = async user => {
  try {
    const lastThirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
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
        [sequelize.literal(`(SELECT COUNT(*) FROM story.views WHERE views.target = stories.hash AND views."createdAt" > '${lastThirtyDays.toISOString()}')`), 'views_last_30_days']
      ],
      group: [ "stories.id", "stories.kind", "stories.author", "stories.hash", "stories.title", 
        "stories.content", "stories.slug", "stories.topics", "stories.poll", 
        "stories.votes", "stories.views", "stories.replies", "stories.likes", "stories.end", 
        "stories.createdAt", "stories.updatedAt", "story_author.id", "story_author.hash", 
        "story_author.bio","story_author.name", "story_author.picture", "story_author.followers", 
        "story_author.following", "story_author.stories", "story_author.verified", "story_author.replies", 
        "story_author.email", "story_sections.kind", "story_sections.content", "story_sections.order", 
        "story_sections.id", "story_sections.title" 
      ],
      order: [
        [sequelize.literal('views_last_30_days'), 'DESC'],
        ['createdAt', 'DESC'],
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
      limit: 6,
      subQuery: false
    });

    const replies = await Reply.findAll({
      attributes: ['kind', 'author', 'story', 'reply', 'hash', 'content', 'views', 'likes', 'replies', 'createdAt', 'updatedAt',
        // Check if the user has liked the reply
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM story.likes WHERE likes.reply = replies.hash AND likes.author = '${user}')`)),
          'liked'
        ],
        [sequelize.literal(`(SELECT COUNT(*) FROM story.views WHERE views.target = replies.hash AND views."createdAt" > '${lastThirtyDays.toISOString()}')`), 'views_last_30_days']
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
      limit: 6,
      subQuery: false
    });

    // Check if the replies || stories exist
    if (replies.length < 1 && stories.length < 1) {
      return {
        replies: [],
        stories: []
      }
    }

    // check if replies exist but stories don't
    if (replies.length > 0 && stories.length < 1) {
      // return the replies: map the replies' dataValues
      const repliesData = replies.map(reply => {
        const data = reply.dataValues;
        data.reply_author = reply.reply_author.dataValues;
        data.you = user === data.author;
        return data;
      });

      return {
        replies: repliesData,
        stories: []
      }
    }

    // check if stories exist but replies don't
    if (replies.length < 1 && stories.length > 0) {
      // return the stories: map the stories' dataValues
      const storiesData = stories.map(story => {
        const data = story.dataValues;
        data.story_author = story.story_author.dataValues;
        data.you = user === data.author;
        // add story sections to the story
        if (story.kind === 'story') {
          data.story_sections = mapFields(data.content, story.story_sections);
        }

        return data;
      });

      return {
        replies: [],
        stories: storiesData
      }
    }

    // return the replies: map the replies' dataValues
    const repliesData = replies.map(reply => {
      const data = reply.dataValues;
      data.reply_author = reply.reply_author.dataValues;
      data.you = user === data.author;
      return data;
    });

    // return the stories: map the stories' dataValues
    const storiesData = stories.map(story => {
      const data = story.dataValues;
      data.story_author = story.story_author.dataValues;
      data.you = user === data.author;
      // add story sections to the story
      if (story.kind === 'story') {
        data.story_sections = mapFields(data.content, story.story_sections);
      }

      return data;
    });

    return {
      replies: repliesData,
      stories: storiesData
    }
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function fetchTrendingWhenLoggedOut
 * @description Query to finding trending stories when logged out: using views in the last 30 days
 * @returns {Object} - The stories object or null, and the error if any
*/
const fetchTrendingWhenLoggedOut = async () => {
  try {
    const lastThirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const stories = await Story.findAll({
      attributes: ['kind', 'author', 'hash', 'title', 'content', 'slug', 'topics', 'poll', 'votes', 'views', 'replies', 'likes', 'end', 'createdAt', 'updatedAt',
        [sequelize.literal(`(SELECT COUNT(*) FROM story.views WHERE views.target = stories.hash AND views."createdAt" > '${lastThirtyDays.toISOString()}')`), 'views_last_30_days']
      ],
      group: [ "stories.id", "stories.kind", "stories.author", "stories.hash", "stories.title", 
        "stories.content", "stories.slug", "stories.topics", "stories.poll", 
        "stories.votes", "stories.views", "stories.replies", "stories.likes", "stories.end", 
        "stories.createdAt", "stories.updatedAt", "story_author.id", "story_author.hash", 
        "story_author.bio","story_author.name", "story_author.picture", "story_author.followers", 
        "story_author.following", "story_author.stories", "story_author.verified", "story_author.replies", 
        "story_author.email", "story_sections.kind", "story_sections.content", "story_sections.order", 
        "story_sections.id", "story_sections.title" 
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
          as: 'story_author',
          attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email'],
        },
        // Include the story sections
        {
          model: StorySection,
          as: 'story_sections',
          attributes: ['kind', 'content', 'order', 'id', 'title', 'content'],
          order: [['order', 'ASC']]
        }
      ],
      limit: 6,
      subQuery: false
    });

    const replies = await Reply.findAll({
      attributes: ['kind', 'author', 'story', 'reply', 'hash', 'content', 'views', 'likes', 'replies', 'createdAt', 'updatedAt',
        [sequelize.literal(`(SELECT COUNT(*) FROM story.views WHERE views.target = replies.hash AND views."createdAt" > '${lastThirtyDays.toISOString()}')`), 'views_last_30_days']
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
      limit: 6,
      subQuery: false
    });

    // Check if the replies || stories exist
    if (replies.length < 1 && stories.length < 1) {
      return {
        replies: [],
        stories: []
      }
    }

    // check if replies exist but stories don't
    if (replies.length > 0 && stories.length < 1) {
      // return the replies: map the replies' dataValues
      const repliesData = replies.map(reply => {
        const data = reply.dataValues;
        data.reply_author = reply.reply_author.dataValues;
        return data;
      });

      return {
        replies: repliesData,
        stories: []
      }
    }

    // check if stories exist but replies don't
    if (replies.length < 1 && stories.length > 0) {
      // return the stories: map the stories' dataValues
      const storiesData = stories.map(story => {
        const data = story.dataValues;
        data.story_author = story.story_author.dataValues;
        // add story sections to the story
        if (story.kind === 'story') {
          data.story_sections = mapFields(data.content, story.story_sections);
        }

        return data;
      });

      return {
        replies: [],
        stories: storiesData
      }
    }

    // return the replies: map the replies' dataValues
    const repliesData = replies.map(reply => {
      const data = reply.dataValues;
      data.reply_author = reply.reply_author.dataValues;
      return data;
    });

    // return the stories: map the stories' dataValues
    const storiesData = stories.map(story => {
      const data = story.dataValues;
      data.story_author = story.story_author.dataValues;
      // add story sections to the story
      if (story.kind === 'story') {
        data.story_sections = mapFields(data.content, story.story_sections);
      }

      return data;
    });

    return {
      replies: repliesData,
      stories: storiesData
    }
  }
  catch (error) {
    throw error;
  }
}

// Export all queries as a single object
module.exports = {
  fetchTrending
}