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
  getTopic, getTopicStories, getTopicContributors, fetchTopic
} = require('./public');

// Export all topic controllers
module.exports = {
  createTopic, updateTopic, deleteTopic,
  createDraft, createTopicSection, updateDraft,
  updateTopicSection, deleteDraft, deleteTopicSection,
  acceptDraft, getTopicSections, getTopicDrafts,
  searchTopics, getTopicByHash, followTopic, subscribeTopic,
  getTopic, getTopicStories, getTopicContributors, fetchTopic
}