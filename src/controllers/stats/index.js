const { getUserStats, getUserAllStats } = require('./user');
const { getTopicStats } = require('./topic');
const {
  fetchStoriesStats, fetchRepliesStats,
  getStories, getReplies
} = require('./profile');

module.exports = {
  getUserStats, getTopicStats, getUserAllStats,
  fetchStoriesStats, fetchRepliesStats,
  getStories, getReplies
}