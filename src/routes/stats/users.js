const {
  getUserStats, getUserAllStats,
  fetchStoriesStats, fetchRepliesStats,
  getStories, getReplies
} = require('../../controllers').statsController;

const { verifyToken } = require('../../middlewares').authMiddleware;

/**
 * @function userStatsRoute
 * @description a modular function that registers all stats route for user
 * @param {Object} app - The express app
 * @param {String} url - The base url, usually '/api/v1' or '/api/v1/s'
 * @returns {void}
*/
module.exports = (app, url) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });
  
  // Route for finding all stories by an author
  app.get(`${url}/u/:hash/stats`, getUserStats);

  // Route for finding all stories by an author
  app.get(`${url}/u/stats`, verifyToken, getUserAllStats);

  // Route for finding all stories stats by an author
  app.get(`${url}/user/stories`, verifyToken, getStories);

  // Route for finding all stories by an author
  app.get(`${url}/user/stats/stories`, verifyToken, fetchStoriesStats);

  // Route for finding all replies stats by an author
  app.get(`${url}/user/stats/replies`, verifyToken, fetchRepliesStats);

  // Route for finding all replies by an author
  app.get(`${url}/user/replies`, verifyToken, getReplies);
}