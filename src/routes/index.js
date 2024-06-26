// Importing all routes and exporting them as a single object
const errors = require('./errors.route');
const auth = require('./auth.route');
const topic = require('./topic.route');
const story = require('./story.route');
const opinion = require('./opinion.route');
const user = require('./user.route');
const {
  joinPages, topicPages, userPages
} = require('./pages');

module.exports = (app) => {
  // apis routes
  auth(app, '/api/v1/a');
  topic(app, '/api/v1/t');
  story(app, '/api/v1/s');
  user(app, '/api/v1/u');
  opinion(app, '/api/v1');

  // public routes
  joinPages(app);
  topicPages(app);
  userPages(app);

  // error routes
  errors(app);
}