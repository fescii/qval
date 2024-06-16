const { login, forgotPassword, verifyUserCode, resetPassword } = require('../controllers').authController;
const { register, checkIfEmailExits } = require('../controllers/').userController;
const { checkDuplicateEmail } = require('../middlewares').authMiddleware;
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
    checkDuplicateEmail,
    register
  );

  //Login route
  app.post(
    `${url}/login`,
    login
  );

  // Check if email already exists
  app.post(
    `${url}/check-email`,
    checkIfEmailExits
  );

  // Reset password
  app.post(
    `${url}/forgot-password`,
    forgotPassword
  );

  // Verify token
  app.post(
    `${url}/verify-token`,
    verifyUserCode
  );

  // Update password
  app.patch(
    `${url}/reset-password`,
    resetPassword
  );
};