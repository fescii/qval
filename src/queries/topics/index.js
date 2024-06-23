// import all topic queries
const {
  addTopic, checkIfTopicExists,
  editTopic, findTopic, removeTopic,
  findTopicBySlug, findTopicsByQuery,
  findTopicBySlugOrHash
} = require('./base.topic');
const {
  addTopicSection, fetchTopicSections, editTopicSection,
  removeTopicSection, addDraft, fetchDrafts,
  editDraft, approveDraft, removeDraft
} = require('./section.topic');
const {
  follow, subscribe, tagStory
} = require('./action.topic');


// Export all topic queries
module.exports = {
  addTopic, checkIfTopicExists, editTopicSection,
  editTopic, findTopic, removeTopic, removeDraft,
  addTopicSection, fetchTopicSections, fetchDrafts,
  addDraft, approveDraft, editDraft, removeTopicSection,
  follow, subscribe, tagStory, findTopicsByQuery,
  findTopicBySlug, findTopicBySlugOrHash
}
