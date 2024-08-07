// Import necessary modules, middlewares, and controllers
const {
  trendingReplies, trendingStories, search,
  trendingTopics, trendingUsers, searchStories,
  searchReplies, searchTopics, searchUsers
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
module.exports = app => {
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

  // Route for handling search stories
  app.get('/api/v1/q/stories', checkToken, searchStories);

  // Route for handling trending replies
  app.get('/api/v1/q/trending/replies', checkToken, trendingReplies);

  // Route for handling search replies
  app.get('/api/v1/q/replies', checkToken, searchReplies);

  // Route for handling trending topics
  app.get('/api/v1/q/trending/topics', checkToken, trendingTopics);

  // Route for handling search topics
  app.get('/api/v1/q/topics', checkToken, searchTopics);

  // Route for handling trending people
  app.get('/api/v1/q/trending/people', checkToken, trendingUsers);

  // Route for handling search people
  app.get('/api/v1/q/people', checkToken, searchUsers);
}