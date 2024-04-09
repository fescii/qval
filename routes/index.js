// Importing all routes
const errors = require('./errors.route');
const auth = require('./auth.route');
const topic = require('./topic.route');

module.exports = (app) => {
  auth(app, '/api/v1/auth');
  topic(app, '/api/v1/topic');
  errors(app);
}