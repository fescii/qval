// Importing all routes and exporting them as a single object
const authQueries = require('./auth.queries');
const topicQueries = require('./topics')
const roleQueries = require('./role.queries');
const storyQueries = require('./story.queries');
const opinionQueries = require('./opinion.queries');
const userQueries = require('./users');

module.exports = {
  authQueries, topicQueries, roleQueries,
  storyQueries, opinionQueries, userQueries,
}