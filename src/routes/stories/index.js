// Import all stroy routes and export them as an object
const storyRoutes  = require('./base');
const replyRoutes  = require('./replies');
const actionRoutes = require('./actions');
const feedsRoutes  = require('./feeds');

// Export all routes as a single object
module.exports = app => {
  storyRoutes(app, '/api/v1/s');
  replyRoutes(app, '/api/v1');
  actionRoutes(app, '/api/v1');
  feedsRoutes(app, '/api/v1');
}