// import all queries 
const {
  findStoriesByAuthor
} = require('./author');

const {
  addStory, checkIfStoryExists, findStory,
  updateStory, findStoryBySlugOrHash,
  findStoriesByTopic, findRelatedStories, removeStory
} = require('./base');


// Export all queries as a single object
module.exports = {
  findStoriesByAuthor,
  addStory, checkIfStoryExists, findStory,
  updateStory, findStoryBySlugOrHash,
  findStoriesByTopic, findRelatedStories, removeStory
};