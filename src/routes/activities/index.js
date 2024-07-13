// Import necessary modules, middlewares, and controllers
const {
  deletingActivity, readingActivity, 
  getActivities, getStoriesActivities,
  getPeopleActivities, getRepliesActivities,
  getTopicsActivities
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
  app.post('/api/v1/c/:id', verifyToken, readingActivity);

  // Route for handling deleting an activity
  app.post('/api/v1/c/:id/:status', verifyToken, deletingActivity);

  // Route for getting all activities
  app.get('/api/v1/c/all', verifyToken, getActivities);

  // Route for getting all stories activities
  app.get('/api/v1/c/stories', verifyToken, getStoriesActivities);

  // Route for getting all people activities
  app.get('/api/v1/c/users', verifyToken, getPeopleActivities);

  // Route for getting all replies activities
  app.get('/api/v1/c/replies', verifyToken, getRepliesActivities);

  // Route for getting all topics activities
  app.get('/api/v1/c/topics', verifyToken, getTopicsActivities);
}