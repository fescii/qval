// Story all routes

const { verifyToken, checkToken } = require('../../middlewares').authMiddleware;
const {
  checkReply, checkReplyContent
} = require('../../middlewares').storyMiddleware;
const {
  createReply, updateReply, deleteReply, createStoryReply,
} = require('../../controllers').storyController;


/**
 * @function replyRoutes
 * @description a modular function that registers all the reply routes
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

  // Route for handling creation a reply
  app.put(`${url}/s/:hash/reply`,
    [verifyToken, checkReply],
    createStoryReply
  );

  // Route for handling creation a reply
  app.put(`${url}/r/:hash/reply`,
    [verifyToken, checkReply],
    createReply
  );

  // Route for handling updating reply content
  app.patch(`${url}/r/:hash/edit`,
    [verifyToken, checkReplyContent],
    updateReply
  );

  // Route for handling reply removal/deletion
  app.delete(`${url}/r/:hash/remove`,
    verifyToken, deleteReply
  );
}