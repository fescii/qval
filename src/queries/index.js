// Importing all routes and exporting them as a single object
const authQueries = require('./auth');
const topicQueries = require('./topics')
const roleQueries = require('./roles');
const userQueries = require('./users');

module.exports = {
  authQueries, topicQueries, roleQueries,
  storyQueries, opinionQueries, userQueries,
}