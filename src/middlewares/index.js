// Import all middlewares and export them as an object
const authMiddleware = require("./auth.middleware");
const topicMiddleware = require('./topic.middleware');
const storyMiddleware = require('./story.middleware');

module.exports = {
  authMiddleware, topicMiddleware,
  storyMiddleware
};