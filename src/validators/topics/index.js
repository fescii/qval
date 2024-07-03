// import all topic validators  and export them as a single object
const { validateTopic } = require('./base');
const { validateSection, validateDraft, validateEditDraft } = require('./section');


module.exports = {
  validateTopic, validateSection, validateDraft,
  validateEditDraft
};