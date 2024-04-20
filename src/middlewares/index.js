// Import all middlewares and export them as an object
const authMiddleware = require("./auth.middleware");
const topicMiddleware = require('./topic.middleware');
const storyMiddleware = require('./story.middleware');

// Export all middlewares as a single object
module.exports = {
  authMiddleware, topicMiddleware,
  storyMiddleware
};