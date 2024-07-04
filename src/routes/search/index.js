// Import necessary modules, middlewares, and controllers
const {
  treandingReplies, trendingStories, search
} = require('../../controllers').searchController;

const {
  checkToken
} = require('../../middlewares').authMiddleware;


/**
 * @function topicRoutes
 * @description a modular function that registers all the story routes(search) to the app
 * @param {Object} app - The express app
 * @returns {void} - No return
*/
module.exports = (app, url) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers", "Access-Control-Allow-Origin", "Access-Control-Allow-Methods",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  // Route for handling search
  app.get('/search', checkToken, search);

  // Route for handling  trending stories
  app.get('/api/v1/q/trending/stories', checkToken, trendingStories);

  // Route for handling trending replies
  app.get('/api/v1/q/trending/replies', checkToken, treandingReplies);
}