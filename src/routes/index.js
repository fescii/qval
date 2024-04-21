// Importing all routes and exporting them as a single object
const errors = require('./errors.route');
const auth = require('./auth.route');
const topic = require('./topic.route');
const story = require('./story.route');
const opinion = require('./opinion.route');
const upvote = require('./upvote.route');
const user = require('./user.route');

module.exports = (app) => {
  auth(app, '/api/v1/a');
  topic(app, '/api/v1/t');
  story(app, '/api/v1/s');
  opinion(app, '/api/v1');
  upvote(app, '/api/v1');
  user(app, '/api/v1/u');
  errors(app);
}