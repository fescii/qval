// Import models
const { Sequelize, sequelize } = require('../../models').models;

// import raw queries
const { followingStories, recentLoggedIn, recentStories } = require('../raw').recent;
/**
 * @function fetchRecent
 * @description Query to finding recent stories
 * @param {String} user - The request data
 * @returns {Object} - The replies object or null, and the error if any
*/
const fetchRecent = async user => {
  try {
    
    let stories = null;

    // check if the user is logged in
    if (user) {
      stories = await findStoriesOfFollowing(user);

      // check if stories is empty
      if (stories.length <= 0) {
        stories = await findRecentStoriesWhenLoggedIn(user);
      }
    }
    else {
      stories = await findRecentStoriesWhenLoggedOut();
    }

    // create a data object
    return { 
      stories: stories,
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
 * @function findStoriesOfFollowing
 * @description Query to find stories of authors that the user is following
 * @param {String} user - User hash
 * @returns {Promise} - Promise object represents the stories of authors that the user is following
*/
const findStoriesOfFollowing = async (user) => {
  try {

    const stories = await sequelize.query(followingStories, {
      replacements: { user: user },
      type: Sequelize.QueryTypes.SELECT
    })

    // check if stories is empty
    if (stories.length <= 0) {
      return [];
    }

    // return the stories: map the stories' dataValues
    const storiesData = stories.map(story => {
      story.you = false;
      // add story sections to the story
      if (story.kind === 'story') {
        story.story_sections = mapFields(story.content, story.story_sections_summary);
      }

      return story;
    });

    return storiesData;
  } catch (error) {
    throw error;
  }
}

/**
 * @function findRecentStoriesWhenLoggedIn
 * @description Query to find recently created stories
 * @param {String} user - User hash
 * @returns {Promise} - Promise object represents the stories published recently
*/
const findRecentStoriesWhenLoggedIn = async user => {
  try {
    const stories = await sequelize.query(recentLoggedIn, {
      replacements: { user: user },
      type: Sequelize.QueryTypes.SELECT
    });

    // check if stories is empty
    if (stories.length <= 0) {
      return [];
    }

   // return the stories: map the stories' dataValues
   const storiesData = stories.map(story => {
    story.you = false;
    // add story sections to the story
    if (story.kind === 'story') {
      story.story_sections = mapFields(story.content, story.story_sections_summary);
    }

    return story;
  });

    return storiesData;
  }
  catch (error) {
    throw error;
  }
}

/**
 * @function findRecentStoriesWhenLoggedOut
 * @description Query to find recently created stories
 * @param {String} user - User hash
 * @returns {Promise} - Promise object represents the stories published recently
*/
const findRecentStoriesWhenLoggedOut = async () => {
  try {
    const stories = await sequelize.query(recentStories, {
      type: Sequelize.QueryTypes.SELECT
    });

    // check if stories is empty
    if (stories.length <= 0) {
      return [];
    }

    // return the stories: map the stories' dataValues
    const storiesData = stories.map(story => {
      story.you = false;
      // add story sections to the story
      if (story.kind === 'story') {
        story.story_sections = mapFields(story.content, story.story_sections_summary);
      }

      return story;
    });

    return storiesData;
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  fetchRecent
}