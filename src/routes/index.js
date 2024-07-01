// Importing all routes and exporting them as a single object
const errors = require('./errors');
const auth = require('./auth');
const topics = require('./topics');
const stories = require('./stories');
const users = require('./users');
const {
  joinPages, topicPages,
} = require('./pages');

module.exports = (app) => {
  // apis routes
  auth(app);
  topics(app);
  stories(app);
  users(app);
  // error routes
  errors(app);
}