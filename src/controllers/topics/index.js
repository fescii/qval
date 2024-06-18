// import all the topic controllers
const {
  createTopic, updateTopic,
  deleteTopic
} = require('./base.topic');

const {
  createDraft, createTopicSection, updateDraft,
  updateTopicSection, deleteDraft, getTopicSections,
  deleteTopicSection, acceptDraft, getTopicDrafts
} = require('./section.topic');

// Export all topic controllers
module.exports = {
  createTopic, updateTopic, deleteTopic,
  createDraft, createTopicSection, updateDraft,
  updateTopicSection, deleteDraft, deleteTopicSection,
  acceptDraft, getTopicSections, getTopicDrafts
}