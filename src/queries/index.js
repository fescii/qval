// Importing all routes and exporting them as a single object
const authQueries = require('./auth.queries');
const topicQueries = require('./topic.queries');
const roleQueries = require('./role.queries');
const storyQueries = require('./story.queries');
const opinionQueries = require('./opinion.queries');
const upvoteQueries = require('./upvote.queries');

module.exports = {
  authQueries, topicQueries, roleQueries,
  storyQueries, opinionQueries, upvoteQueries
}