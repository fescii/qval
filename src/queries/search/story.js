// Import models
const { Sequelize, sequelize, Story } = require('../../models').models;
const { storiesLoggedIn, feedStories } = require('../raw').feed;

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
    let queryStr = query.trim();

    // refine the query: make the query to match containing, starting or ending with the query
    queryStr = queryStr.split(' ').map((q) => `${q}:*`).join(' | ');

    // add query to back to the req data
    const queryOptions = {
      user: user,
      query: queryStr,
      offset: offset,
      limit: limit,
    }
    
    // build the query(vector search)
    let stories = await Story.search(queryOptions);

    if (stories.length < 1) {
      // create a data object
      return { 
        data: {
          stories: stories,
          limit: limit,
          offset: offset,
          last: true,
        },
      error: null 
      }
    }

    // return the stories: map the stories' dataValues
    stories =  stories.map(story => {
      story.you = user === story.author;
      // add story sections to the story
      if (story.kind === 'story') {
        story.story_sections = mapFields(story.content, story.story_sections_summary);
      }
      return story;
    });

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
  
  if (!data || data.length <= 0) {
    return html;
  }
  else {
    // NB: 0: kind, 1: content, 2: order, 3: id, 4: title, 5: createdAt, 6: updatedAt
    const sections =  data.map(section => {
      const title = section[4] !== null ? `<h2 class="title">${section[4]}</h2>` : '';
      return /*html*/`
        <div class="section" order="${section[2]}" id="section${section[3]}" kind="${section[0]}">
          ${title}
          ${section[1]}
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
    const stories = await sequelize.query(storiesLoggedIn, {
      replacements: {
        user: user, 
        daysAgo: thirtyDaysAgo.toISOString(),
        offset: offset, 
        limit: limit 
      },
      type: Sequelize.QueryTypes.SELECT
    });

    // Check if the stories exist
    if (stories.length < 1) {
      return [];
    }

    // return the stories: map the stories' dataValues
    return stories.map(story => {
      story.you = user === story.author;
      // add story sections to the story
      if (story.kind === 'story') {
        story.story_sections = mapFields(story.content, story.story_sections_summary);
      }

      return story;
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
    const stories = await sequelize.query(feedStories, {
      replacements: {
        daysAgo: thirtyDaysAgo.toISOString(),
        offset: offset,
        limit: limit 
      },
      type: Sequelize.QueryTypes.SELECT
    });

    // Check if the stories exist
    if (stories.length < 1) {
      return [];
    }

    // return the stories: map the stories' dataValues
    return stories.map(story => {
      story.you = false;
      // add story sections to the story
      if (story.kind === 'story') {
        story.story_sections = mapFields(story.content, story.story_sections_summary);
      }

      return story;
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