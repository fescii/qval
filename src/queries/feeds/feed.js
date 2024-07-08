// Import models
const { Sequelize, sequelize} = require('../../models').models;
const { storiesLoggedIn, repliesLoggedIn, feedStories, feedReplies } = require('../raw').feed;

/**
 * @function fetchFeeds
 * @description Query to finding trending stories and replies
 * @param {Object} reqData - The request data
 * @returns {Object} - The stories object or null, and the error if any
*/
const fetchFeeds = async reqData => {
  try {
    const { user, limit, page } = reqData;

    // calculate the offset and limit
    const offset = (page - 1) * limit;

    const data =  user ? await fetchFeedsWhenLoggedIn(user, offset, limit) : await fetchFeedsWhenLoggedOut(offset, limit);

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
  
  if (!data || data.length <= 0) {
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
 * @function fetchFeedsWhenLoggedIn
 * @description Query to finding trending stories an replies when logged in: using views and likes in the last 7 days
 * @param {String} user - The user hash
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The stories object or null, and the error if any
*/
const fetchFeedsWhenLoggedIn = async (user, offset, limit) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const stories = await sequelize.query(storiesLoggedIn, {
      replacements: {
        user, 
        daysAgo: sevenDaysAgo.toISOString(),
        offset, 
        limit 
      },
      type: Sequelize.QueryTypes.SELECT
    });

    const replies = await sequelize.query(repliesLoggedIn, {
      replacements: {
        user, 
        daysAgo: sevenDaysAgo.toISOString(),
        offset, 
        limit 
      },
      type: Sequelize.QueryTypes.SELECT
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
        reply.you = user === reply.author;
        return reply;
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
        story.you = user === story.author;
        // add story sections to the story
        if (story.kind === 'story') {
          story.story_sections = mapFields(story.content, story.story_sections_summary);
        }

        return story;
      });

      return {
        replies: [],
        stories: storiesData
      }
    }

    // return the replies: map the replies' dataValues
    const repliesData = replies.map(reply => {
      reply.you = user === reply.author;
      return reply;
    });

    // return the stories: map the stories' dataValues
    const storiesData = stories.map(story => {
      story.you = user === story.author;
      // add story sections to the story
      if (story.kind === 'story') {
        story.story_sections = mapFields(story.content, story.story_sections_summary);
      }

      return story;
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
 * @function fetchFeedsWhenLoggedOut
 * @description Query to finding trending stories when logged out: using views in the last 30 days
 * @param {Number} offset - the offset number
 * @param {Number} limit - The limit number
 * @returns {Object} - The stories object or null, and the error if any
*/
const fetchFeedsWhenLoggedOut = async (offset, limit) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const stories = await sequelize.query(feedStories, {
      replacements: { 
        daysAgo: sevenDaysAgo.toISOString(),
        offset: 0,
        limit: 6
      },
      type: Sequelize.QueryTypes.SELECT
    });

    const replies = await sequelize.query(feedReplies, {
      replacements: { 
        daysAgo: sevenDaysAgo.toISOString(),
        offset: 0,
        limit: 6
      },
      type: Sequelize.QueryTypes.SELECT
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
        reply.like = false;
        reply.you = false;
        return reply;
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
        story.you = false;
        // add story sections to the story
        if (story.kind === 'story') {
          story.story_sections = mapFields(story.content, story.story_sections_summary);
        }

        return story;
      });

      return {
        replies: [],
        stories: storiesData
      }
    }

    // return the replies: map the replies' dataValues
    const repliesData = replies.map(reply => {
      reply.like = false;
      reply.you = false;
      return reply;
    });


    // return the stories: map the stories' dataValues
    const storiesData = stories.map(story => {
      story.you = false;
      // add story sections to the story
      if (story.kind === 'story') {
        story.story_sections = mapFields(story.content, story.story_sections_summary);
      }

      return story;
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
  fetchFeeds
}