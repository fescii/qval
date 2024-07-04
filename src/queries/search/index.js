const { findRepliesByQuery, findTrendingReplies } = require('./reply');
const { findStoriesByQuery, findTrendingStories }= require('./story');
const { findTopicsByQuery, findTrendingTopics }= require('./topic');
const { findTrendingUsers, findUsersByQuery } = require('./user');

module.exports = {
  findRepliesByQuery, findTrendingReplies, findStoriesByQuery, findTrendingStories,
  findTopicsByQuery, findTrendingTopics, findTrendingUsers, findUsersByQuery
}
