const { authMiddleware, topicMiddleware } = require('../middlewares');
const {
  createTopic, updateTopic,
  deleteTopic
} = require('../controllers').topicController;

module.exports = (app, url) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Creating a new topic
  app.put(`${url}/add`,
    [authMiddleware.verifyToken, topicMiddleware.checkDuplicateTopic],
    createTopic
  );

  // Updating existing token
  app.patch(`${url}/:topicHash/edit`,
    authMiddleware.verifyToken,
    updateTopic
  );

  // Deleting a topic
  app.delete(`${url}/:topicHash/remove`,
    authMiddleware.verifyToken,
    deleteTopic
  );
};