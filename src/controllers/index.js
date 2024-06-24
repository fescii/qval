// Importing all controllers then exporting them as a single object
const authController = require('./auth');
const errorController = require('./error');
const topicController = require('./topics');
const storyController = require('./stories');
const userController = require('./users')

/**
 * Exporting all controllers as a single object
*/
module.exports = {
  authController, topicController,
  errorController, storyController, userController
};