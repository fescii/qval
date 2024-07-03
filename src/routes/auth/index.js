// Import all stroy routes and export them as an object
const authRoutes  = require('./base');
const publicRoutes = require('./public');

// Export all routes as a single object
module.exports = app => {
  authRoutes(app, '/api/v1/a');
  publicRoutes(app);
}