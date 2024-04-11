const { authMiddleware, topicMiddleware } = require('../middlewares');
const {
  createTopic, updateTopic
} = require('../controllers').topicController;

module.exports = (app, url) => {
  app.use((req, res, next) => {
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
  
  // Creating a new topic
  app.patch(`${url}/:topicHash/edit`,
    authMiddleware.verifyToken,
    updateTopic
  );
};