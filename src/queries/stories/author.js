// Importing the required modules, fns, configs, and utils...

const {
  getStoriesWhenLoggedIn, getStoriesWhenLoggedOut, 
  getRepliesWhenLoggedIn, getRepliesWhenLoggedOut
} = require('./helper');

const {
  getUserReplies, getUserStories,
} = require('./user');

/**
 * @function findStoriesByAuthor
 * @description a function that finds stories by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The stories object and error if any
*/
const findStoriesByAuthor = async (reqData) => {
  try {
    const {
      author, user, totalStories, page, limit
    } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // check if stories is less than the limit + offset
    if (totalStories < limit + offset) {
      limit = totalStories - offset;
    }

    // Find the stories
    const where = { author, published: true};
    const order = [['createdAt', 'DESC']];

    // initialize the stories to be null
    let stories = null;

    // check if user is logged in
    if (user === null) {
      const fetchedStories = await getStoriesWhenLoggedOut(where, order, limit, offset);

      // If there is an error: throw the error
      if (fetchedStories.error) {
        throw fetchedStories.error;
      }

      // set the stories
      stories = fetchedStories.stories; 
    }
    else if (user === author) {
      const fetchedStories = await getUserStories(where, order, user, limit, offset);

      // If there is an error: throw the error
      if (fetchedStories.error) {
        throw fetchedStories.error;
      }

      // set the stories
      stories = fetchedStories.stories;
    }
    else {
      const fetchedStories =  await getStoriesWhenLoggedIn(where, order, user, limit, offset);

      // If there is an error: throw the error
      if (fetchedStories.error) {
        throw fetchedStories.error;
      }

      // set the stories
      stories = fetchedStories.stories;  
    }

    // Check if the stories exist
    if (stories === null) {
      return { data: null, error: null };
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
 * @function findRepliesByAuthor
 * @description a function that finds replies by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The replies object and error if any
*/
const findRepliesByAuthor = async (reqData) => {
  try {
    const {
      author, user, totalReplies, page, limit
    } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // check if replies is less than the limit + offset
    if (totalReplies < limit + offset) {
      limit = totalReplies - offset;
    }

    // Find the replies
    const where = { author, published: true};
    const order = [['createdAt', 'DESC']];

    // initialize the replies to be null
    let replies = null;

    // check if user is logged in
    if (user === null){
      const fetchedReplies = await getRepliesWhenLoggedOut(where, order, limit, offset);

      // If there is an error: throw the error
      if (fetchedReplies.error) {
        throw fetchedReplies.error;
      }

      // set the replies
      replies = fetchedReplies.replies;
    }
    else if (user === author) {
      const fetchedReplies = await getUserReplies(where, order, user, limit, offset);

      // If there is an error: throw the error
      if (fetchedReplies.error) {
        throw fetchedReplies.error;
      }

      // set the replies
      replies = fetchedReplies.replies;
    }
    else if (user !== null) {
      const fetchedReplies =  await getRepliesWhenLoggedIn(where, order, user, limit, offset);

      // If there is an error: throw the error
      if (fetchedReplies.error) {
        throw fetchedReplies.error;
      }

      // set the replies
      replies = fetchedReplies.replies;  
    }

    // Check if the replies exist
    if (replies === null) {
      return { data: null, error: null };
    }

    // calculate the total number of pages
    const totalPages = Math.ceil(replies / limit);

    const last = page === totalPages;

    // create a data object
    const data = {
      replies: replies,
      limit: limit,
      offset: offset,
      pages: totalPages,
      last: last,
    }

    // return the replies
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}

// Export the module
module.exports = {
  findStoriesByAuthor, findRepliesByAuthor
};