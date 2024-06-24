// import models
const {Like, View} = require('../../models').models;

/**
 * @function likeStory
 * @description Query to like or unlike a story
 * @param {String} user - The hash of the user following the story
 * @param {String} story - The hash of the story to like
 * @returns {Object} - The like object or null, and the error if any
*/
const likeStory = async (user, story) => {
  try {
    // get or create the like object
    const [like, created] = await Like.findOrCreate({
      where: {
        author: user,
        target: story
      },
      defaults: {
        author: user,
        target: story
      }
    });

    // if the like object was created: return like: true
    if (created) {
      return { liked: true, error: null };
    }
    else {
      // if the like object was not created: delete it
      await like.destroy();
      return { liked: false, error: null };
    }
  }
  catch (error) {
    return { liked: null, error };
  }
}

/**
 * @function likeReply
 * @description Query to like or unlike a reply
 * @param {String} user - The hash of the user following the reply
 * @param {String} reply - The hash of the reply to like
 * @returns {Object} - The like object or null, and the error if any
*/
const likeReply = async (user, reply) => {
  try {
    // get or create the like object
    const [like, created] = await Like.findOrCreate({
      where: {
        author: user,
        target: reply
      },
      defaults: {
        author: user,
        target: reply
      }
    });

    // if the like object was created: return liked: true
    if (created) {
      return { liked: true, error: null };
    }
    else {
      // if the like object was not created: delete it
      await like.destroy();
      return { liked: false, error: null };
    }
  } 
  catch (error) {
    return { liked: null, error };
  }
}

/**
 * @function viewContent
 * @description Query to add a view to a story or reply or a topic, or user profile
 * @param {String} user - The hash of the user viewing the content || can be null
 * @param {String} target - The hash of the content being viewed
 * @returns {Object} - The view object or null, and the error if any
*/
const viewContent = async (user, target) => {
  try {
    // create a view object
    const view = await View.create({author: user, target});

    // return the view object
    return { viewed: view, error: null };
  }
  catch (error) {
    return { viewed: null, error };
  }
}
module.exports = {
  likeStory, likeReply, viewContent
}