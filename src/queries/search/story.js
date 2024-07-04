// Import models
const { Sequelize, sequelize, Story, StorySection, User } = require('../../models').models;


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
    const offset = (page - 1) * limit;
    
    let stories = null;

    // check if the user is logged in
    if (user) {
      stories = await trendingStoriesWhenLoggedIn(user, offset, limit);
    }
    else {
      stories = await trendingStoriesWhenLoggedOut(offset, limit);
    }

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
        [sequelize.literal(`(SELECT COUNT(*) FROM story.views WHERE views.target = stories.hash AND views."createdAt" > '${thirtyDaysAgo.toISOString()}')`), 'views_last_30_days']
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
        [sequelize.literal(`(SELECT COUNT(*) FROM story.views WHERE views.target = stories.hash AND views."createdAt" > '${thirtyDaysAgo.toISOString()}')`), 'views_last_30_days']
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

// Export all queries as a single object
module.exports = {
  findStoriesByQuery, findTrendingStories
};