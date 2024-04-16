// Import within the app
const { Upvote, Story } = require("../models").models;
const { upvoteQueue } = require('../bull');

// A hook function for updating of total upvotes in a story
const upvoteHook = async () => {
  try {
    // Listen to the upvoteQueue for new jobs (upvotes)
    upvoteQueue.process(async (job) => {
      const upvote = job.data; // Data contains the upvote object
      const storyId = upvote.story;
      const totalLikes = await Upvote.count({ where: { story: storyId } });
      await Story.update({ total_upvotes: totalLikes }, { where: { id: storyId } });
    });

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