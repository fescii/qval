const { getUserStats, getUserAllStats } = require('./user');
const { getTopicStats } = require('./topic');
const {
  getUserStoriesStats, getUserRepliesStats,
  getUserStories, getUserReplies
} = require('./profile');

module.exports = {
  getUserStats, getTopicStats, getUserAllStats,
  getUserStoriesStats, getUserRepliesStats,
  getUserStories, getUserReplies
}