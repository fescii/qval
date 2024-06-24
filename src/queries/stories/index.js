// import all queries 
const {
  findStoriesByAuthor
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


// Export all queries as a single object
module.exports = {
  findStoriesByAuthor,
  addStory, checkIfStoryExists, findStory,
  updateStory, findStoryBySlugOrHash, findStoriesByQuery,
  findStoriesByTopic, findRelatedStories, removeStory
};