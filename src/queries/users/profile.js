// Import user and sequelize from models
const { sequelize, Sequelize } = require('../../models').models;
const { 
  userReplies, userRepliesStats, userStories, 
  userStoriesStats
} = require('../raw').profile;



// Map story fields(sections) to html
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
 * @function fetchUserStoriesStats
 * @description A query function to get the stories of a user: most viewed, most liked
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const fetchUserStoriesStats = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  const stories = await sequelize.query(userStoriesStats, {
    replacements: {user, offset,  limit },
    type: Sequelize.QueryTypes.SELECT
  });

  // map the stories' sections
  return stories.map(story => {
    story.you = user === story.author;
    // add story sections to the story
    if (story.kind === 'story') {
      story.story_sections = mapFields(story.content, story.story_sections_summary);
    }

    return story;
  });
};

/**
 * @function fetchUserRepliesStats
 * @description A query function to get the replies of a user: most viewed, most liked
 * @param {Object} reqData - The request data
 * @returns {Promise<Array>} - A promise that resolves to an array of the top 5 recommended users
*/
const fetchUserRepliesStats = async reqData => {
  const  { user, limit, page } = reqData;

  // calculate the offset
  const offset = (page - 1) * limit;

  return await sequelize.query(userRepliesStats, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
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

  const stories = await sequelize.query(userStories, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });

  // map the stories' sections
  return stories.map(story => {
    story.you = user === story.author;
    // add story sections to the story
    if (story.kind === 'story') {
      story.story_sections = mapFields(story.content, story.story_sections_summary);
    }

    return story;
  });
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

  return await sequelize.query(userReplies, {
    replacements: { user, offset, limit },
    type: Sequelize.QueryTypes.SELECT
  });
};

module.exports = {
  fetchUserStoriesStats, fetchUserRepliesStats,
  fetchUserStories, fetchUserReplies
}