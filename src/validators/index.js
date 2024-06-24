// Importing validator files and exporting them as a single object
const userValidator = require('./users');
const topicValidator = require('./topics');
const storyValidator = require('./stories');

module.exports = {
  userValidator, topicValidator, storyValidator
};