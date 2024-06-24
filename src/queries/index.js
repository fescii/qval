// Importing all routes and exporting them as a single object
const authQueries = require('./auth');
const topicQueries = require('./topics')
const roleQueries = require('./roles');
const userQueries = require('./users');
const storyQueries = require('./stories');

module.exports = {
  authQueries, topicQueries, roleQueries,
  storyQueries, userQueries,
}