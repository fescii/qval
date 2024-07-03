// Import all stroy routes and export them as an object
const userRoutes  = require('./users');

// Export all routes as a single object
module.exports = app => {
  userRoutes(app, '/api/v1');
}