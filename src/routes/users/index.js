// Import all stroy routes and export them as an object
const userRoutes  = require('./base');
const publicRoutes = require('./public');

// Export all routes as a single object
module.exports = app => {
  userRoutes(app, '/api/v1/u');
  publicRoutes(app);
}