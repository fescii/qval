const { sectionController } = require('../controllers');
const { authMiddleware, uploadMiddleware } = require('../middlewares');


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Endpoint for creating a section
  app.post(
    "/api/v1/post/:postId/section/add",
    authMiddleware.verifyToken,
    sectionController.createSection
  );

  // Endpoint for updating a section
  app.post(
    "/api/v1/section/:sectionId/edit",
    authMiddleware.verifyToken,
    sectionController.updateSection
  );


  // Endpoint for deleting a section
  app.post(
    "/api/v1/section/:sectionId/delete",
    authMiddleware.verifyToken,
    sectionController.deleteSection
  );

  // Endpoint for uploading post cover image
  app.post(
    "/api/v1/section/:sectionId/upload/cover",
    [authMiddleware.verifyToken, uploadMiddleware.sectionImageUpload],
    postController.updateCoverImage
  );
};