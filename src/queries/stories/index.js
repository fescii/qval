// import all queries 
const {
  findStoriesByAuthor, findRepliesByAuthor
} = require('./author');

const {
  addStory, checkIfStoryExists, findStory,
  updateStory, findStoryBySlugOrHash, findStoriesByQuery,
   removeStory
} = require('./base');

const {
  findStoriesByTopic,
  findRelatedStories
} = require('./topic');

const {
  addStorySection, editStorySection, removeStorySection
} = require('./section');


// Export all queries as a single object
module.exports = {
  findStoriesByAuthor, findRepliesByAuthor,
  addStory, checkIfStoryExists, findStory,
  updateStory, findStoryBySlugOrHash, findStoriesByQuery,
  findStoriesByTopic, findRelatedStories, removeStory,
  addStorySection, editStorySection, removeStorySection
};