// Importing all controllers then exporting them as a single object
const authController = require('./auth.controller');
const errorController = require('./error.controller');
const topicController = require('./topic.controller');
const storyController = require('./story.controller');
const opinionController = require('./opinion.controller');

module.exports = {
  authController, topicController,
  errorController, storyController,
  opinionController
};