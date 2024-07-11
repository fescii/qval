// Importing the required modules, fns, configs, and utils...

const {
  getRepliesWhenLoggedIn, getRepliesWhenLoggedOut
} = require('./helper');

const {
  getUserReplies,
} = require('./user');

const {
  getLikesWhenLoggedIn, getLikesWhenLoggedOut
} = require('./likes');


/**
 * @function findStoryReplies
 * @description a function that finds replies by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The replies object and error if any
*/
const findStoryReplies = async (reqData) => {
  try {
    const {
      hash, user, page, limit
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

    // Check if the replies exist
    if (replies === null) {
      return { 
        data: {
          limit: limit,
          offset: offset,
          replies: [],
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
 * @function findReplyReplies
 * @description a function that finds replies by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The replies object and error if any
*/
const findReplyReplies = async (reqData) => {
  try {
    const {
      hash, user, page, limit
    } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the replies
    const where = { reply: hash };
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
 * @function findStoryLikes
 * @description a function that finds likes by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The likes object and error if any
*/
const findStoryLikes = async (reqData) => {
  try {
    const {
      hash, user, page, limit
    } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the likes
    const where = { story: hash };
    const order = [['createdAt', 'DESC']];

    // initialize the likes to be null
    let likes = null;

    // check if user is logged in
    if (user === null){
      const fetchedLikes = await getLikesWhenLoggedOut(where, order, limit, offset);

      // set the likes
      likes = fetchedLikes;
    }
    else if (user !== null) {
      const fetchedLikes =  await getLikesWhenLoggedIn(where, order, user, limit, offset);

      // set the likes
      likes = fetchedLikes;  
    }

    // Check if the likes exist
    if (likes === null) {
      return { 
        data: {
          limit: limit,
          offset: offset,
          people: [],
          last: true,
        }, error: null 
      };
    }

    const last = likes.length < limit;

    // create a data object
    const data = {
      people: likes,
      limit: limit,
      offset: offset,
      last: last,
    }

    // return the likes
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}

/**
 * @function findReplyLikes
 * @description a function that finds likes by author in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The likes object and error if any
*/
const findReplyLikes = async (reqData) => {
  try {
    const {
      hash, user, page, limit
    } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the likes
    const where = { reply: hash };
    const order = [['createdAt', 'DESC']];

    // initialize the likes to be null
    let likes = null;

    // check if user is logged in
    if (!user){
      const fetchedLikes = await getLikesWhenLoggedOut(where, order, limit, offset);

      // set the likes
      likes = fetchedLikes;
    }
    else {
      const fetchedLikes =  await getLikesWhenLoggedIn(where, order, user, limit, offset);

      // set the likes
      likes = fetchedLikes;  
    }

    // Check if the likes exist
    if (likes === null) {
      return { 
        data: {
          limit: limit,
          offset: offset,
          people: [],
          last: true,
        }, error: null 
      };
    }

    const last = likes.length < limit;

    // create a data object
    const data = {
      people: likes,
      limit: limit,
      offset: offset,
      last: last,
    }

    // return the likes
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}

// Export the module
module.exports = {
  findReplyReplies, findStoryReplies,
  findReplyLikes, findStoryLikes
};