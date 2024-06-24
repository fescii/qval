// Importing the required modules, fns, configs, and utils...
const { Sequelize} = require('../../models').models;
const Op = Sequelize.Op;

// Import the helper functions
const { 
  getStoriesWhenLoggedIn, getStoriesWhenLoggedOut
} = require('./helper');


/**
 * @function findStoriesByTopic
 * @description a function that finds stories by topic in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The stories object and error if any
*/
const findStoriesByTopic = async (reqData) => {
  try {

    // dEstructure the request data
    const { topic, user, totalStories, page, limit } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // check if stories is less than the limit + offset
    if (totalStories < limit + offset) {
      limit = totalStories - offset;
    }

    // Find the stories
    const where = { 
      published: true,
      topics: { [Op.contains]: [topic] } 
    };
    const order = [['createdAt', 'DESC']];

    // initialize the stories to be null
    let stories = null;

    // check if user is logged in
    if (user !== null) {
      const fetchedStories =  await getStoriesWhenLoggedIn(where, order, user, limit, offset);

      // If there is an error: throw the error
      if (fetchedStories.error) {
        throw fetchedStories.error;
      }

      // set the stories
      stories = fetchedStories.stories;  
    }
    else {
      const fetchedStories = await getStoriesWhenLoggedOut(where, order, limit, offset);

      // If there is an error: throw the error
      if (fetchedStories.error) {
        throw fetchedStories.error;
      }

      // set the stories
      stories = fetchedStories.stories;
    }

    // Check if the stories exist
    if (stories === null) {
      return { stories: null, error: null };
    }

    // calculate the total number of pages
    const totalPages = Math.ceil(stories / limit);

    const last = page === totalPages;

    // create a data object
    const data = {
      stories: strories,
      limit: limit,
      offset: offset,
      pages: totalPages,
      last: last,
    }

    // return the stories
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}

/**
 * @function findRelatedStories
 * @description a function that finds stories by topic in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The stories object and error if any
*/
const findRelatedStories = async (reqData) => {
  try {
    // Destructure the request data
    const { topics, user, totalStories, page, limit } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // check if stories is less than the limit + offset
    if (totalStories < limit + offset) {
      limit = totalStories - offset;
    }

    // Find the stories
    const where = {
      published: true,
      topics: { [Op.contains]: topics } 
    };

    const order = [['createdAt', 'DESC']];

    // initialize the stories to be null
    let stories = null;

    // check if user is logged in
    if (user !== null) {
      const fetchedStories =  await getStoriesWhenLoggedIn(where, order, user, limit, offset);

      // If there is an error: throw the error
      if (fetchedStories.error) {
        throw fetchedStories.error;
      }

      // set the stories
      stories = fetchedStories.stories;  
    }
    else {
      const fetchedStories = await getStoriesWhenLoggedOut(where, order, limit, offset);

      // If there is an error: throw the error
      if (fetchedStories.error) {
        throw fetchedStories.error;
      }

      // set the stories
      stories = fetchedStories.stories;
    }

    // Check if the stories exist
    if (stories === null) {
      return { stories: null, error: null };
    }

    // calculate the total number of pages
    const totalPages = Math.ceil(stories / limit);

    const last = page === totalPages;

    // create a data object
    const data = {
      stories: strories,
      limit: limit,
      offset: offset,
      pages: totalPages,
      last: last,
    }

    // return the stories
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}


// Export the query functions
module.exports = {
  findStoriesByTopic,
  findRelatedStories
}