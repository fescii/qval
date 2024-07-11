// Import all stroy routes and export them as an object
const userRoutes  = require('./users');
const topicRoutes = require('./topic');

// Export all routes as a single object
module.exports = app => {
  userRoutes(app, '/api/v1');
  topicRoutes(app, '/api/v1');
}