// Importing all routes and exporting them as a single object
const errors = require('./errors');
const auth = require('./auth');
const topics = require('./topics');
const stories = require('./stories');
const users = require('./users');
const stats = require('./stats');
const search = require('./search');
const feeds = require('./feeds');
const activities = require('./activities');

module.exports = (app) => {
  // apis routes
  auth(app);
  topics(app);
  stories(app);
  users(app);
  stats(app);
  search(app);
  feeds(app);
  activities(app);
  // error routes
  errors(app);
}