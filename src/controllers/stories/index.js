// Import all stroy controllers and export them as an object
const {
  createStory, updateStory, deleteStory, checkStoryBySlug, updateTitle,
   updateSlug,  findStories, publishAStory
} = require('./base');

const {
  likeStoryController, likeReplyController, viewContentController
} = require('./action');

const {
  createReply, updateReply, deleteReply,
  createStoryReply
} = require('./reply');

const { findAuthorReplies, findAuthorStories } = require('./author');

const {
  createStorySection, updateStorySection, deleteStorySection,
  getStorySections
} = require('./section');

const { getRelatedStories, getTopicStories } = require('./topic');

const { voteController } = require('./vote');

const { getStory, getStoryLikes } = require('./public');


// Export all controllers as a single object
module.exports = {
  createStory, updateStory, deleteStory, voteController, createStoryReply,
  checkStoryBySlug, updateTitle, updateSlug, getTopicStories, getStoryLikes,
  likeStoryController, likeReplyController, findStories, publishAStory,
  viewContentController, createReply, updateReply, deleteReply, getStorySections,
  findAuthorReplies, findAuthorStories, getRelatedStories, getStory,
  createStorySection, updateStorySection, deleteStorySection
}