// import all queries 
const {
  findStoriesByAuthor, findRepliesByAuthor
} = require('./author');

const {
  addStory, checkIfStoryExists, findStory,
  editStory, findStoryBySlugOrHash, findStoriesByQuery,
  removeStory, editSlug, editTitle
} = require('./base');

const {
  findStoriesByTopic,
  findRelatedStories
} = require('./topic');

const {
  addStorySection, editStorySection, removeStorySection
} = require('./section');

const {
  addVote
} = require('./vote');

const {
  likeReply, likeStory, viewContent
} = require('./action');

const {
  addReply, editReply, removeReply
} = require('./reply');

// Export all queries as a single object
module.exports = {
  findStoriesByAuthor, findRepliesByAuthor, editTitle, editSlug,
  addStory, checkIfStoryExists, findStory, addVote,
  editStory, findStoryBySlugOrHash, findStoriesByQuery,
  findStoriesByTopic, findRelatedStories, removeStory,
  addStorySection, editStorySection, removeStorySection,
  likeReply, likeStory, viewContent, addReply, editReply, removeReply
};