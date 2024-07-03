// import all queries 
const { 
  findStoriesByAuthor, findRepliesByAuthor, 
  findFollowersByAuthor, findFollowingByAuthor
} = require('./author');

const {
  addStory, checkIfStoryExists, findStory,
  editStory, findStoryBySlugOrHash, findStoriesByQuery,
  removeStory, editSlug, editTitle, publishStory, findReplyByHash
} = require('./base');

const { findStoriesByTopic, findRelatedStories, findTopicContributors } = require('./topic');

const { addStorySection, editStorySection, removeStorySection, fetchStorySections } = require('./section');

const {addVote} = require('./vote');

const { likeReply, likeStory, viewContent } = require('./action');

const { addReply, editReply, removeReply } = require('./reply');

const { findReplyReplies, findStoryReplies, findStoryLikes, findReplyLikes } = require('./feeds')

// Export all queries as a single object
module.exports = {
  findStoriesByAuthor, findRepliesByAuthor, editTitle, editSlug, findReplyLikes,
  addStory, checkIfStoryExists, findStory, addVote, publishStory, findStoryLikes,
  editStory, findStoryBySlugOrHash, findStoriesByQuery, fetchStorySections,
  findStoriesByTopic, findRelatedStories, removeStory, findReplyByHash,
  addStorySection, editStorySection, removeStorySection, findReplyReplies,
  likeReply, likeStory, viewContent, addReply, editReply, removeReply, findStoryReplies,
  findFollowersByAuthor, findFollowingByAuthor, findTopicContributors
};