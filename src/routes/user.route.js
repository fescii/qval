// Import middlewares and controllers
const { veryToken } = require('../middlewares').authMiddleware;
const {
  updateProfilePicture, updateProfileBio,
  updateProfileContact, updateProfilePassword,
} = require('../controllers').userController;


/**
 * @function userRoutes
 * @description a modular function that registers all the user routes
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
  app.patch(
    `${url}/edit/picture`,
    veryToken,
    updateProfilePicture
  );

  // Update user bio route
  app.patch(
    `${url}/edit/bio`,
    veryToken,
    updateProfileBio
  );

  // Update user contact route
  app.patch(
    `${url}/edit/contact`,
    veryToken,
    updateProfileContact
  );

  // Update user password route
  app.patch(
    `${url}/edit/password`,
    veryToken,
    updateProfilePassword
  );
};