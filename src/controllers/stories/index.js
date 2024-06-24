// Import all stroy controllers and export them as an object
const {
  createStory, updateStory, deleteStory,
  checkStoryBySlug, updateTitle, updateSlug,
  findStories
} = require('./base');

const {
  likeStoryController, likeReplyController,
  viewContentController
} = require('./action');

const {
  createReply, updateReply, deleteReply
} = require('./reply')


// Export all controllers as a single object
module.exports = {
  createStory, updateStory, deleteStory,
  checkStoryBySlug, updateTitle, updateSlug,
  likeStoryController, likeReplyController, findStories,
  viewContentController, createReply, updateReply, deleteReply
}