// Import controllers and middlewares
const { verifyToken } = require('../middlewares').authMiddleware;
const { upvoteStory, likeOpinion } = require('../controllers').upvoteController;


/**
 * @function upvoteRoutes
 * @description a modular function that registers all the upvote routes
 * @param {Object} app - The express app
 * @param {String} url - The base url, usually '/api/v1' or '/api/v1/u'
*/
module.exports = (app, url) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  // Route for handling story upvotes
  app.post(`${url}/s/:storyHash/upvote`,
    verifyToken,
    upvoteStory
  );

  // Route for handling opinion likes
  app.post(`${url}/o/:opinionHash/upvote`,
    verifyToken,
    likeOpinion
  );
}