// import all topic queries
const {
  addTopic, checkIfTopicExists,
  editTopic, findTopic, removeTopic
} = require('./base.topic');
const {
  addTopicSection, getTopicSections, updateTopicSection,
  addDraft, approveDraft, updateDraft
} = require('./section.topic');
const {
  followTopic, subscribeTopic, tagStory
} = require('./action.topic');


// Export all topic queries
module.exports = {
  addTopic, checkIfTopicExists,
  editTopic, findTopic, removeTopic,
  addTopicSection, getTopicSections, updateTopicSection,
  addDraft, approveDraft, updateDraft,
  followTopic, subscribeTopic, tagStory
}
