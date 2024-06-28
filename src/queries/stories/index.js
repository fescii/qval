// import all queries 
const { findStoriesByAuthor, findRepliesByAuthor } = require('./author');

const {
  addStory, checkIfStoryExists, findStory,
  editStory, findStoryBySlugOrHash, findStoriesByQuery,
  removeStory, editSlug, editTitle, publishStory, findReplyByHash
} = require('./base');

const { findStoriesByTopic, findRelatedStories } = require('./topic');

const { addStorySection, editStorySection, removeStorySection, fetchStorySections } = require('./section');

const {addVote} = require('./vote');

const { likeReply, likeStory, viewContent } = require('./action');

const { addReply, editReply, removeReply } = require('./reply');

const { findReplyReplies, findStoryReplies } = require('./feeds')

// Export all queries as a single object
module.exports = {
  findStoriesByAuthor, findRepliesByAuthor, editTitle, editSlug,
  addStory, checkIfStoryExists, findStory, addVote, publishStory,
  editStory, findStoryBySlugOrHash, findStoriesByQuery, fetchStorySections,
  findStoriesByTopic, findRelatedStories, removeStory, findReplyByHash,
  addStorySection, editStorySection, removeStorySection, findReplyReplies,
  likeReply, likeStory, viewContent, addReply, editReply, removeReply, findStoryReplies
};