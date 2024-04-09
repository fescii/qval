const { topicController } = require('../controllers');
const { authMiddleware, topicMiddleware } = require('../middlewares');

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
    topicController.createTopic
  );
  
  //Login route
  // app.post(
  //   `${url}/login`,
  //   authController.signIn
  // );
};