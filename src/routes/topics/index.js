// Import all stroy routes and export them as an object
const baseRoutes  = require('./base');
const publicRoutes = require('./public');

// Export all routes as a single object
module.exports = app => {
  baseRoutes(app, '/api/v1/t');
  publicRoutes(app);
}