// import all topic validators  and export them as a single object
const { validateTopic } = require('./base.topic');
const { validateSection, validateDraft, validateEditDraft } = require('./section.topic');


module.exports = {
  validateTopic, validateSection, validateDraft,
  validateEditDraft
};