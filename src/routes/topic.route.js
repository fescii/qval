// const { authMiddleware, topicMiddleware } = require('../middlewares');
// const {
//   createTopic, updateTopic,
//   deleteTopic
// } = require('../controllers').topicController;

/**
 * @function topicRoutes
 * @description a modular function that registers all the topic routes
 * @param {Object} app - The express app
 * @param {String} url - The base url, usually '/api/v1' or '/api/v1/t'
*/
module.exports = (app, url) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // // Creating a new topic
  // app.put(`${url}/add`,
  //   [authMiddleware.verifyToken, topicMiddleware.checkDuplicateTopic],
  //   createTopic
  // );

  // // Updating existing topic
  // app.patch(`${url}/:topicHash/edit`,
  //   authMiddleware.verifyToken,
  //   updateTopic
  // );

  // // Deleting an existing topic
  // app.delete(`${url}/:topicHash/remove`,
  //   authMiddleware.verifyToken,
  //   deleteTopic
  // );
};