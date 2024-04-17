// Import within the app
const { Upvote, Story, Like, Opinion } = require("../models").models;


// A hook function for updating of total upvotes in a story
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
      const storyHash = data.story;
      const totalUpvotes = await Upvote.count({ where: { story: storyHash } });
      await Story.update({ total_upvotes: totalUpvotes }, { where: { hash: storyHash } });
    }
    else {
      const opinionHash = data.opinion;
      const totalLikes = await Like.count({ where: { opinion: opinionHash } });
      await Opinion.update({ total_likes: totalLikes }, { where: { id: opinionHash } });
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