const { getUserStats, getUserAllStats } = require('./user');
const { getTopicStats } = require('./topic');
const {
  fetchStoriesStats, fetchRepliesStats,
  getStories, getReplies, getActivities,
  getNotifications, getUnreadNotifications
} = require('./profile');

module.exports = {
  getUserStats, getTopicStats, getUserAllStats,
  fetchStoriesStats, fetchRepliesStats,
  getStories, getReplies, getActivities,
  getNotifications, getUnreadNotifications
}