// Importing all routes and exporting them as a single object
const errors = require('./errors');
const auth = require('./auth');
const topics = require('./topics');
const stories = require('./stories');
const users = require('./users');
const {
  joinPages, topicPages, userPages
} = require('./pages');

module.exports = (app) => {
  // apis routes
  auth(app, '/api/v1/a');
  topics(app, '/api/v1/t');
  stories(app);
  users(app, '/api/v1/u');

  // public routes
  joinPages(app);
  topicPages(app);
  userPages(app);

  // error routes
  errors(app);
}