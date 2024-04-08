const { authController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Register route
  app.put(
    "/api/v1/auth/register",
    authMiddleware.checkDuplicateEmail,
    authController.signUp
  );

  //Login route
  app.post(
    "/api/v1/auth/login",
    authController.signIn
  );
};