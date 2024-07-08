const feedQueries = require('./feed');
const recentQueries = require('./recent');
const topicQueries = require('./topic');
const userQueries = require('./user');

module.exports = {
  feed: feedQueries,
  recent: recentQueries,
  topic: topicQueries,
  user: userQueries
}