// Import within the app
const { Upvote, Story } = require("../models").models;

// A hook function for updating of total upvotes in a story
const upvoteHook = async (upvote) => {

  try {
    // Sequelize hook to update total_votes when a new upvote is added or removed
    Upvote.afterCreate(async (upvote) => {
      const storyId = upvote.story;
      const totalLikes = await Upvote.count({ where: { story: storyId } });
      await Story.update({ total_upvotes: totalLikes }, { where: { id: storyId } });
    });
  }
  catch (error) {
    // Report this error
    console.log(error);
    // TODO: create a handler for handling this error
  }
}


// Export all hooks
module.exports = {
  upvoteHook
}