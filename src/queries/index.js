// Importing all routes and exporting them as a single object
const authQueries = require('./auth');
const topicQueries = require('./topics')
const roleQueries = require('./roles');
const userQueries = require('./users');
const storyQueries = require('./stories');
const statsQueries = require('./stats');

module.exports = {
  authQueries, topicQueries, roleQueries,
  storyQueries, userQueries, statsQueries
}