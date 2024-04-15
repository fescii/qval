// Importing all routes and exporting them as a single object
const errors = require('./errors.route');
const auth = require('./auth.route');
const topic = require('./topic.route');
const story = require('./story.route');

module.exports = (app) => {
  auth(app, '/api/v1/auth');
  topic(app, '/api/v1/topic');
  story(app, '/api/v1/s');
  errors(app);
}