// import all topic queries
const {
  addTopic, checkIfTopicExists,
  editTopic, findTopic, removeTopic,
  findTopicBySlug, findTopicsByQuery,
  findTopicBySlugOrHash
} = require('./base');
const {
  addTopicSection, fetchTopicSections, editTopicSection,
  removeTopicSection, addDraft, fetchDrafts,
  editDraft, approveDraft, removeDraft
} = require('./section');
const {
  follow, subscribe, tagStory
} = require('./action');


// Export all topic queries
module.exports = {
  addTopic, checkIfTopicExists, editTopicSection,
  editTopic, findTopic, removeTopic, removeDraft,
  addTopicSection, fetchTopicSections, fetchDrafts,
  addDraft, approveDraft, editDraft, removeTopicSection,
  follow, subscribe, tagStory, findTopicsByQuery,
  findTopicBySlug, findTopicBySlugOrHash
}
