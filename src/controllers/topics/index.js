// import all the topic controllers
const {
  createTopic, updateTopic,
  deleteTopic, searchTopics, getTopicByHash
} = require('./base');

const {
  createDraft, createTopicSection, updateDraft,
  updateTopicSection, deleteDraft, getTopicSections,
  deleteTopicSection, acceptDraft, getTopicDrafts
} = require('./section');

const {
  followTopic, subscribeTopic
} = require('./action');

const {
  getTopic, getTopicStories, getTopicContributors, fetchTopic,
  editTopic
} = require('./public');

// Export all topic controllers
module.exports = {
  createTopic, updateTopic, deleteTopic, editTopic,
  createDraft, createTopicSection, updateDraft,
  updateTopicSection, deleteDraft, deleteTopicSection,
  acceptDraft, getTopicSections, getTopicDrafts,
  searchTopics, getTopicByHash, followTopic, subscribeTopic,
  getTopic, getTopicStories, getTopicContributors, fetchTopic
}