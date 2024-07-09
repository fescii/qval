const {
  getUserStats, getUserAllStats
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
}