const feedQueries = require('./feed');
const recentQueries = require('./recent');
const topicQueries = require('./topic');

module.exports = {
  feed: feedQueries,
  recent: recentQueries,
  topic: topicQueries
}