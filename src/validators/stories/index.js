// Import all validators and export them as an object
const {
  validateStory,
  validateContent
} = require('./base');

const {
  validateSection, validateSectionContent
} = require('./section');

const {
  validateReply, validateReplyContent
} = require('./reply');


// Export all validators as a single object
module.exports = {
  validateStory, validateContent,
  validateSection, validateSectionContent,
  validateReply, validateReplyContent
};