// Import necessary modules, middlewares, and controllers
const {
  getNotifications, getReadNotifications, getTotalUnreadNotifications,
  getUnreadNotifications, getStoriesNotifications, getRepliesNotifications,
  getTopicsNotifications, getPeopleNotifications
} = require('../../controllers').userController.notifications;

const {
  verifyToken
} = require('../../middlewares').authMiddleware;


/**
 * @function topicRoutes
 * @description a modular function that registers all notifications routes
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

  // Route for getting all notifications
  app.get('/api/v1/n/all', verifyToken, getNotifications);

  // Route for getting all read notifications
  app.get('/api/v1/n/read', verifyToken, getReadNotifications);

  // Route for getting all unread notifications
  app.get('/api/v1/n/unread', verifyToken, getUnreadNotifications);

  // Route for getting unread notifications
  app.get('/api/v1/n/unread/total', verifyToken, getTotalUnreadNotifications);

  // Route for getting stories notifications
  app.get('/api/v1/n/stories', verifyToken, getStoriesNotifications);

  // Route for getting  replies notifications
  app.get('/api/v1/n/replies', verifyToken, getRepliesNotifications);

  // Route for getting topics notifications
  app.get('/api/v1/n/topics', verifyToken, getTopicsNotifications);

  // Route for getting people notifications
  app.get('/api/v1/n/users', verifyToken, getPeopleNotifications);
}