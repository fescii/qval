// Import necessary modules, middlewares, and controllers
const {
  deletingActivity, readingActivity
} = require('../../controllers').activityController;

const {
  verifyToken
} = require('../../middlewares').authMiddleware;


/**
 * @function topicRoutes
 * @description a modular function that registers all activities routes
 * @param {Object} app - The express app
 * @returns {void} - No return
*/
module.exports = app => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers", "Access-Control-Allow-Origin", "Access-Control-Allow-Methods",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  // Route for handling reading an activity
  app.post('/api/v1/n/:id', verifyToken, readingActivity);

  // Route for handling deleting an activity
  app.post('/api/v1/n/:id/:status', verifyToken, deletingActivity);
}