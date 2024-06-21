// import all the topic controllers
const {
  createTopic, updateTopic,
  deleteTopic, searchTopics, getTopicByHash
} = require('./base.topic');

const {
  createDraft, createTopicSection, updateDraft,
  updateTopicSection, deleteDraft, getTopicSections,
  deleteTopicSection, acceptDraft, getTopicDrafts
} = require('./section.topic');

const {
  followTopic, subscribeTopic
} = require('./action.topic');

// Export all topic controllers
module.exports = {
  createTopic, updateTopic, deleteTopic,
  createDraft, createTopicSection, updateDraft,
  updateTopicSection, deleteDraft, deleteTopicSection,
  acceptDraft, getTopicSections, getTopicDrafts,
  searchTopics, getTopicByHash, followTopic, subscribeTopic
}