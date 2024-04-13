// Importing validator files and exporting them as a single object
const userValidator = require('./user.validator');
const postValidator = require('./post.validator');
const topicValidator = require('./topic.validator');
const storyValidator = require('./story.validator');

module.exports = {
  userValidator, storyValidator,
  postValidator, topicValidator
};