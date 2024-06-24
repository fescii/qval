// Import all stroy controllers and export them as an object
const {
  createStory, updateStory, deleteStory,
  checkStoryBySlug, updateTitle, updateSlug
} = require('./base');


// Export all controllers as a single object
module.exports = {
  createStory, updateStory, deleteStory,
  checkStoryBySlug, updateTitle, updateSlug
}