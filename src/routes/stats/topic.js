const {
  getTopicStats
} = require('../../controllers').statsController;

/**
 * @function topicStatsRoute
 * @description a modular function that registers all stats route for topic
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
  app.get(`${url}/t/:hash/stats`, getTopicStats);
}