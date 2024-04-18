// Importing middlewares and controllers
const { verifyToken } = require('../middlewares').authMiddleware;
const {
  createOpinion, updateOpinion,
  deleteOpinion, createReplyOpinion
} = require('../controllers').opinionController;


/**
 * @function opinionRoutes
 * @description a modular function that registers all the opinion routes
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

  // Route for handling opinion creation
  app.put(`${url}/s/:storyHash/add/opinion`,
    verifyToken,
    createOpinion
  );

  // Route for handling opinion update
  app.patch(`${url}/o/:opinionHash/edit`,
    verifyToken,
    updateOpinion
  );

  // Route for handling all opinion replies
  app.put(`${url}/o/:opinionHash/reply`,
    verifyToken,
    createReplyOpinion
  );

  // Route for handling opinion deletion
  app.delete(`${url}/o/:opinionHash/remove`,
    verifyToken,
    deleteOpinion
  );
}
