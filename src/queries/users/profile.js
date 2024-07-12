// Import user and sequelize from models
const { sequelize, Sequelize } = require('../../models').models;
const { 
  userReplies, userRepliesStats, userStories, 
  userStoriesStats, userActivities, userNotifications
} = require('../raw').profile;

const { Activity } = require('../../models').models;


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
 * @function getUserStoriesStats
 * @description A query function to get the stories of a user: most viewed, most liked
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const getUserStoriesStats = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  try {
    const stories = await sequelize.query(userStoriesStats, {
      replacements: {
        user,
        offset, 
        limit 
      },
      type: Sequelize.QueryTypes.SELECT
    });

    // map the stories' sections
    const storiesData = stories.map(story => {
      story.you = user === story.author;
      // add story sections to the story
      if (story.kind === 'story') {
        story.story_sections = mapFields(story.content, story.story_sections_summary);
      }

      return story;
    });

    return {
      stories: storiesData,
      error: null
    }
  }
  catch (error) {
    return {
      stories: [],
      error: error
    }
  }
};

/**
 * @function getUserRepliesStats
 * @description A query function to get the replies of a user: most viewed, most liked
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const getUserRepliesStats = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  try {
    const replies = await sequelize.query(userRepliesStats, {
      replacements: {
        user,
        offset, 
        limit 
      },
      type: Sequelize.QueryTypes.SELECT
    });

    return {
      replies: replies,
      error: null
    }
  }
  catch (error) {
    return {
      replies: [],
      error: error.message
    }
  }
};

/**
 * @function fetchUserStories
 * @description A query function to get the stories of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const fetchUserStories = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  try {
    const stories = await sequelize.query(userStories, {
      replacements: {
        user,
        offset, 
        limit 
      },
      type: Sequelize.QueryTypes.SELECT
    });

    // map the stories' sections
    const storiesData = stories.map(story => {
      story.you = user === story.author;
      // add story sections to the story
      if (story.kind === 'story') {
        story.story_sections = mapFields(story.content, story.story_sections_summary);
      }

      return story;
    });

    return {
      stories: storiesData,
      error: null
    }
  }
  catch (error) {
    return {
      stories: [],
      error: error.message
    }
  }
};

/**
 * @function fetchUserReplies
 * @description A query function to get the replies of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const fetchUserReplies = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  try {
    const replies = await sequelize.query(userReplies, {
      replacements: {
        user,
        offset, 
        limit 
      },
      type: Sequelize.QueryTypes.SELECT
    });

    return {
      replies: replies,
      error: null
    }
  }
  catch (error) {
    return {
      replies: [],
      error: error.message
    }
  }
};

/**
 * @function fetchUserActivities
 * @description A query function to get the activities of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 activities
*/
const fetchUserActivities = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  try {
    const activities = await sequelize.query(userActivities, {
      replacements: {
        user,
        offset, 
        limit 
      },
      type: Sequelize.QueryTypes.SELECT
    });

    return {
      activities: activities,
      error: null
    }
  }
  catch (error) {
    return {
      activities: [],
      error: error.message
    }
  }
};

/**
 * @function fetchUserNotifications
 * @description A query function to get the notifications of a user
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of 10 notifications
*/
const fetchUserNotifications = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  try {
    const notifications = await sequelize.query(userNotifications, {
      replacements: {
        user,
        offset, 
        limit 
      },
      type: Sequelize.QueryTypes.SELECT
    });

    return {
      notifications: notifications,
      error: null
    }
  }
  catch (error) {
    return {
      notifications: [],
      error: error.message
    }
  }
};

/**
 * @function  totalUnreadNotifications
 * @description A query that fetches total unread notifications by a logged in user
 * @returns {Number} A number of unread notifications
*/
const totalUnreadNotifications = async user => {
  return await Activity.count({ where: { to: user, read: false } });
}

module.exports = {
  getUserStoriesStats, getUserRepliesStats, fetchUserStories,
  fetchUserReplies, fetchUserActivities, fetchUserNotifications,
  totalUnreadNotifications
}