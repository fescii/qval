// Importing the required modules, fns, configs, and utils...

const {
  getStoriesWhenLoggedIn, getStoriesWhenLoggedOut, 
  getRepliesWhenLoggedIn, getRepliesWhenLoggedOut
} = require('./helper');

const {
  getUserReplies, getUserStories,
} = require('./user');


/**
 * @function findStoryReplies
 * @description a function that finds replies by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The replies object and error if any
*/
const findStoryReplies = async (reqData) => {
  try {
    const {
      hash, user, totalReplies, page, limit
    } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the replies
    const where = { story: hash};
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
    else if (user === hash) {
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

    // calculate the total number of pages
    const totalPages = Math.ceil(totalReplies / limit);

    const last = page === totalPages;

    // Check if the replies exist
    if (replies === null) {
      return { 
        data: {
          limit: limit,
          offset: offset,
          pages: totalPages,
          last: true,
        }, error: null 
      };
    }

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

/**
 * @function findReplyReplies
 * @description a function that finds replies by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The replies object and error if any
*/
const findReplyReplies = async (reqData) => {
  try {
    const {
      hash, user, totalReplies, page, limit
    } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the replies
    const where = { reply: hash};
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
    else if (user === hash) {
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

    // calculate the total number of pages
    const totalPages = Math.ceil(totalReplies / limit);

    const last = page === totalPages;

    // Check if the replies exist
    if (replies === null) {
      return { 
        data: {
          limit: limit,
          offset: offset,
          pages: totalPages,
          last: true,
        }, error: null 
      };
    }

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
  findReplyReplies, findStoryReplies
};