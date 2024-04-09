// Importing all routes
const errors = require('./errors.route');
const auth = require('./auth.route');

module.exports = app => {
  auth(app);
  errors(app);
}