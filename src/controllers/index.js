// Importing Timestamp Function
const authController = require('./auth.controller');
const errorController = require('./error.controller');
const topicController = require('./topic.controller');

module.exports = {
  authController, topicController,
  errorController
};