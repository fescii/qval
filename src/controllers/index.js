// Importing all controllers then exporting them as a single object
const authController = require('./auth');
const errorController = require('./error.controller');
const topicController = require('./topic.controller');
const storyController = require('./story.controller');
const opinionController = require('./opinion.controller');
const upvoteController = require('./upvote.controller');
const userController = require('./users')

/**
 * Exporting all controllers as a single object
*/
module.exports = {
  authController, topicController,
  errorController, storyController,
  opinionController, upvoteController,
  userController
};