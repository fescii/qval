// Import within the app
const { Upvote, Story, Like, Opinion } = require("../models").models;

/**
 * @function upvoteHook
 * @name upvoteHook
 * @description A Hook function that updates the total upvotes in a story or an opinion
 * @param {Object} data - Data object (story or opinion)
 * @returns {Promise<void>} - Returns a promise of void data
*/
const upvoteHook = async (data) => {
  if (!data) {
    // Log the error
    console.error('Data is undefined. Cannot initialize upvote hook process');

    return;
  }

  // Log the process initialization
  console.log('Upvote hook process initialized');

  try {
    if (data.story) {
      // Get the total upvotes for the story
      const storyHash = data.story;
      const totalUpvotes = await Upvote.count({ where: { story: storyHash } });

      // Update the total upvotes for the story
      await Story.update({ total_upvotes: totalUpvotes }, { where: { hash: storyHash } });
    }
    else {
      // Get the total likes for the opinion
      const opinionHash = data.opinion;
      const totalLikes = await Like.count({ where: { opinion: opinionHash } });

      // Update the total likes for the opinion
      await Opinion.update({ total_upvotes: totalLikes }, { where: { hash: opinionHash } });
    }
    // Log the process completion
    console.log('Upvote hook process completed');
  }
  catch (error) {
    console.error('Error initializing upvote hook process:', error);
    // TODO: Create a handler for handling this error
  }
};


// Export all hooks
module.exports = {
  upvoteHook
}