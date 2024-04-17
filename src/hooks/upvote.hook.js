// Import within the app
const { Upvote, Story } = require("../models").models;


// A hook function for updating of total upvotes in a story
const upvoteHook = async (upvote) => {
  try {
    // const upvote = job.data; // Data contains the upvote object
    const storyHash = upvote.story;
    const totalLikes = await Upvote.count({ where: { story: storyHash } });
    await Story.update({ total_upvotes: totalLikes }, { where: { hash: storyHash } });
    console.log('Upvote hook process initialized');
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