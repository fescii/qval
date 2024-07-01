// Import all stroy controllers and export them as an object
const {
  createStory, updateStory, deleteStory, checkStoryBySlug, updateTitle,
  updateSlug,  findStories, publishAStory
} = require('./base');

const { likeStoryController, likeReplyController, viewContentController } = require('./action');

const { createReply, updateReply, deleteReply, createStoryReply } = require('./reply');

const { findAuthorReplies, findAuthorStories, findUserFollowers, findUserFollowing } = require('./author');

const { createStorySection, updateStorySection, deleteStorySection, getStorySections } = require('./section');

const { getRelatedStories, getTopicStories, getTopicContributors } = require('./topic');

const { voteController } = require('./vote');

const { getStory, getStoryLikes, getReply, getReplyLikes } = require('./public');

const { getReplyReplies, getStoryReplies, fetchReplyLikes, fetchStoryLikes } = require('./feeds');


// Export all controllers as a single object
module.exports = {
  createStory, updateStory, deleteStory, voteController, createStoryReply,
  checkStoryBySlug, updateTitle, updateSlug, getTopicStories, getStoryLikes,
  likeStoryController, likeReplyController, findStories, publishAStory,getReplyReplies, 
  getStoryReplies, viewContentController, createReply, updateReply, deleteReply, 
  getStorySections, findAuthorReplies, findAuthorStories, getRelatedStories, getStory, 
  getReplyLikes, createStorySection, updateStorySection, deleteStorySection, getReply,
  fetchReplyLikes, fetchStoryLikes, findUserFollowers, findUserFollowing, getTopicContributors
}