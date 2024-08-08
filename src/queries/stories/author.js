// Importing the required modules, fns, configs, and utils...

const {
  getStoriesWhenLoggedIn, getStoriesWhenLoggedOut, 
  getRepliesWhenLoggedIn, getRepliesWhenLoggedOut,
} = require('./helper');

const {
  getUserReplies, getUserStories,
  fetchFollowersWhenLoggedIn, fetchFollowingWhenLoggedIn,
  fetchFollowersWhenLoggedOut, fetchFollowingWhenLoggedOut
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
      hash, user, page, limit
    } = reqData;

    // Construct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the stories
    const where = { author: hash, published: true};
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
    else if (user === hash) {
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
      return { 
        data: {
          stories: [],
          limit: limit,
          offset: offset,
          last: true,
        }, error: null 
      };
    }

    const last = stories.length < limit;

    // create a data object
    const data = {
      stories: stories,
      limit: limit,
      offset: offset,
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
      hash, user, page, limit
    } = reqData;

    // Construct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the replies
    const where = { author: hash};
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

    // Check if the replies exist
    if (replies === null) {
      return { 
        data: {
          replies: [],
          limit: limit,
          offset: offset,
          last: true,
        }, error: null 
      };
    }

    const last = replies.length < limit;

    // create a data object
    const data = {
      replies: replies,
      limit: limit,
      offset: offset,
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
 * @function findFollowersByAuthor
 * @description a function that finds followers by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The followers object and error if any
*/
const findFollowersByAuthor = async (reqData) => {
  try {
    const {
      hash, user, page, limit
    } = reqData;

    // Construct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the followers
    const where = { to: hash };
    const order = [['createdAt', 'DESC']];

    // initialize the followers to be null
    let followers = null;

    // check if user is logged in
    if (!user){
      followers = await fetchFollowersWhenLoggedOut(where, order, limit, offset);
    }
    else {
      followers =  await fetchFollowersWhenLoggedIn(where, order, user, limit, offset); 
    }

    // Check if the followers exist
    if (followers === null) {
      return { 
        data: {
          limit: limit,
          offset: offset,
          people: [],
          last: true,
        }, error: null 
      };
    }

    const last = followers.length < limit;

    // create a data object
    const data = {
      people: followers,
      limit: limit,
      offset: offset,
      last: last,
    }

    // return the followers
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}

/**
 * @function findFollowingByAuthor
 * @description a function that finds following by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The following object and error if any
*/
const findFollowingByAuthor = async (reqData) => {
  try {
    const {
      hash, user, page, limit
    } = reqData;

    // Construct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the following
    const where = { from: hash };
    const order = [['createdAt', 'DESC']];

    // initialize the following to be null
    let following = null;

    // check if user is logged in
    if (!user){
      following = await fetchFollowingWhenLoggedOut(where, order, limit, offset);
    }
    else {
      following =  await fetchFollowingWhenLoggedIn(where, order, user, limit, offset); 
    }

    // Check if the following exist
    if (following === null) {
      return { 
        data: {
          limit: limit,
          offset: offset,
          people: [],
          last: true,
        }, error: null 
      };
    }

    const last = following.length < limit;
    // create a data object
    const data = {
      people: following,
      limit: limit,
      offset: offset,
      last: last,
    }

    // return the following
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}

// Export the module
module.exports = {
  findStoriesByAuthor, findRepliesByAuthor,
  findFollowersByAuthor, findFollowingByAuthor
};