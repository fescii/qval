const { authController } = require('../controllers');
const { authMiddleware } = require("../middlewares");

const base_url = "/api/v1/auth";

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    `${base_url}/register`,
    authMiddleware.checkDuplicateUsernameOrEmail,
    authController.signUp
  );

  app.post(`${base_url}/login`, authController.signIn);
};