const { authController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

/**
 * @function authRoutes
 * @description a modular function that registers all the auth routes
 * @param {Object} app - The express app
 * @param {String} url - The base url, usually '/api/v1' or '/api/v1/auth'
*/
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

  // Check if email already exists
  app.post(
    `${url}/check-email`,
    authController.checkIfEmailExits
  );

  // Reset password
  app.post(
    `${url}/forgot-password`,
    authController.forgotPassword
  );

  // Verify token
  app.post(
    `${url}/verify-token`,
    authController.verifyUserCode
  );
};