const { postController } = require('../controllers');
const { authMiddleware, uploadMiddleware } = require('../middlewares');


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Endpoint for creating a new article
  app.post(
    "/api/v1/post/add",
    authMiddleware.verifyToken,
    postController.createPost
  );

  // Endpoint for updating an article
  app.post(
    "/api/v1/post/:postId/edit",
    authMiddleware.verifyToken,
    postController.updatePost
  );

  // Endpoint for updating article status
  app.post(
    "/api/v1/post/:postId/edit/status",
    authMiddleware.verifyToken,
    postController.updatePostStatus
  );

  // Endpoint for uploading post cover image
  app.post(
    "/api/v1/post/:postId/upload/cover",
    [authMiddleware.verifyToken, uploadMiddleware.imageUpload],
    postController.updateCoverImage
  );
};