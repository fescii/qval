// Importing all routes
const auth = require('./auth.route');
const post = require('./post.route');

module.exports = app => {
  auth(app);
  post(app);
}