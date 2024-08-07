// Import middlewares and controllers
const { verifyToken } = require('../../middlewares').authMiddleware;
const upload = require('../../middlewares').upload;
const {
  updateProfilePicture, updateProfileBio, updateProfileName,
  updateProfileContact, updateProfilePassword, followUser,
  updateProfileEmail, getAuthorInfo
} = require('../../controllers').userController;


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
  app.patch(`${url}/edit/profile`,
    verifyToken, upload.single('file'),
    updateProfilePicture
  );

  // Update user bio route
  app.patch(`${url}/edit/bio`,
    verifyToken,
    updateProfileBio
  );

  // Update user email route
  app.patch(`${url}/edit/email`,
    verifyToken,
    updateProfileEmail
  );

  // Update user contact route
  app.patch(`${url}/edit/contact`,
    verifyToken,
    updateProfileContact
  );

  // Update user password route
  app.patch(`${url}/edit/password`,
    verifyToken,
    updateProfilePassword
  );

  // Update user name route
  app.patch(`${url}/edit/name`,
    verifyToken,
    updateProfileName
  );

  // Follow user route
  app.patch(`${url}/:hash/follow`,
    verifyToken,
    followUser
  );

  // Get author contact route
  app.get(`${url}/author/info`, verifyToken, getAuthorInfo);
};