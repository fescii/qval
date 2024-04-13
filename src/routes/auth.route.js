const { authController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

module.exports = (app, url) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Register route
  app.put(
    `${url}/register`,
    authMiddleware.checkDuplicateEmail,
    authController.signUp
  );

  //Login route
  app.post(
    `${url}/login`,
    authController.signIn
  );
};