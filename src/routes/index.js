// Importing all routes and exporting them as a single object
const errors = require('./errors');
const auth = require('./auth');
const topics = require('./topics');
const stories = require('./stories');
const users = require('./users');
const stats = require('./stats');

module.exports = (app) => {
  // apis routes
  auth(app);
  topics(app);
  stories(app);
  users(app);
  stats(app);
  // error routes
  errors(app);
}