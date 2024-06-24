// Import all stroy controllers and export them as an object
const {
  createStory, updateStory, deleteStory, checkStoryBySlug, updateTitle, updateSlug,  findStories
} = require('./base');

const {
  likeStoryController, likeReplyController, viewContentController
} = require('./action');

const {
  createReply, updateReply, deleteReply
} = require('./reply');

const {
  findAuthorReplies, findAuthorStories
} = require('./author');

const {
  createStorySection, updateStorySection, deleteStorySection
} = require('./section');

const {
  getRelatedStories, getTopicStories
} = require('./topic');

const { 
  voteController
} = require('./vote');


// Export all controllers as a single object
module.exports = {
  createStory, updateStory, deleteStory, voteController,
  checkStoryBySlug, updateTitle, updateSlug, getTopicStories,
  likeStoryController, likeReplyController, findStories,
  viewContentController, createReply, updateReply, deleteReply,
  findAuthorReplies, findAuthorStories, getRelatedStories,
  createStorySection, updateStorySection, deleteStorySection
}