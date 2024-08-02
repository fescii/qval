// Import necessary modules, middlewares, and controllers
const {
  getTopic, getTopicStories, getTopicContributors, fetchTopic,
  editTopic
} = require('../../controllers').topicController;

const {
  checkToken, verifyLogin
} = require('../../middlewares').authMiddleware;


/**
 * @function topicRoutes
 * @description a modular function that registers all the topic routes
 * @param {Object} app - The express app
 * @returns {void} - No return
*/
module.exports = (app) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers", "Access-Control-Allow-Origin", "Access-Control-Allow-Methods",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });


  // Route for handling topic page
  app.get('/t/:topic', checkToken, getTopic);

  // Route for handling topic articles page
  app.get('/t/:topic/article', checkToken, getTopic);

  // Route for handling topic stories page
  app.get('/t/:topic/stories', checkToken, getTopicStories);

  // Route for handling topic contributors page
  app.get('/t/:topic/contributors', checkToken, getTopicContributors);

  // Route for fetching topic
  app.get('/api/v1/t/:topic/preview', checkToken, fetchTopic);

  // Route for editing topic
  app.get('/t/:hash/edit', verifyLogin, editTopic);
}