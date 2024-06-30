// Importing middlewares and controllers
const { verifyToken, checkToken } = require('../../middlewares').authMiddleware;
const {
  likeReplyController, likeStoryController, viewContentController,
  voteController
} = require('../../controllers').storyController;


/**
 * @function actionRoutes
 * @description a modular function that registers all the like routes
 * @param {Object} app - The express app
 * @param {String} url - The base url, usually '/api/v1' or '/api/v1/o'
*/
module.exports = (app, url) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });


  // Route for handling liking a story
  app.post(`${url}/p/:hash/like`,
    verifyToken, likeStoryController
  );

  // Route for handling liking a reply
  app.post(`${url}/r/:hash/like`,
    verifyToken, likeReplyController
  );

  // Route for handling viewing content
  app.post(`${url}/:hash/view/:kind`,
    checkToken, viewContentController
  );

  // Route for handling voting
  app.post(`${url}/p/:hash/vote/:option`,
    verifyToken, voteController
  );
}
