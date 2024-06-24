// Importing the required modules, fns, configs, and utils...

const {
  getStoriesWhenLoggedIn, getStoriesWhenLoggedOut
} = require('./helper');

/**
 * @function findStoriesByAuthor
 * @description a function that finds stories by author in the database: 10 at a time orderd by the date created
 * @param {String} author - The author hash
 * @param {String} user - The user hash: the current user
 * @param {Number} totalStories - The total number of stories the user has published
 * @param {Number} limit - The limit for pagination: default 10
 * @param {Number} page - The current page number
 * @returns {Object} data - The stories object and error if any
 * @returns {Array} data.stories - The stories array
 * @returns {Number} data.limit - The limit for pagination
 * @returns {Number} data.offset - The offset for pagination
 * @returns {Number} data.pages - The total number of pages
 * @returns {Number} data.page - The current page
*/
const findStoriesByAuthor = async (author, user, totalStories, limit=10) => {
  try {
    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // check if stories is less than the limit + offset
    if (totalStories < limit + offset) {
      limit = totalStories - offset;
    }

    // Find the stories
    const where = { author };
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

// Export the module
module.exports = {
  findStoriesByAuthor
};