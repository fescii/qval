// Importing validator files and exporting them as a single object
const userValidator = require('./users');
const postValidator = require('./post.validator');
const topicValidator = require('./topics');
const storyValidator = require('./story.validator');
const opinionValidator = require('./opinion.validator');

module.exports = {
  userValidator, storyValidator,
  postValidator, topicValidator, opinionValidator
};