// import all topic queries
const {
  addTopic, checkIfTopicExists,
  editTopic, findTopic, removeTopic
} = require('./base.topic');
const {
  addTopicSection, fetchTopicSections, editTopicSection,
  removeTopicSection, addDraft,
  editDraft, approveDraft, removeDraft
} = require('./section.topic');
const {
  followTopic, subscribeTopic, tagStory
} = require('./action.topic');


// Export all topic queries
module.exports = {
  addTopic, checkIfTopicExists, editTopicSection,
  editTopic, findTopic, removeTopic, removeDraft,
  addTopicSection, fetchTopicSections,
  addDraft, approveDraft, editDraft, removeTopicSection,
  followTopic, subscribeTopic, tagStory
}
