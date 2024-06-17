// import all the topic controllers
const {
  createTopic, updateTopic,
  deleteTopic
} = require('./base.topic');

const {
  createDraft, createTopicSection, updateDraft,
  updateTopicSection, deleteDraft,
  deleteTopicSection, acceptDraft
} = require('./section.topic');

// Export all topic controllers
module.exports = {
  createTopic, updateTopic, deleteTopic,
  createDraft, createTopicSection, updateDraft,
  updateTopicSection, deleteDraft, deleteTopicSection,
  acceptDraft
}