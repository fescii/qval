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

  // Endpoint for creating a new blog post
  app.post(
    "/api/v1/post/add",
    authMiddleware.verifyToken,
    postController.createPost
  );

  // Endpoint for uploading post cover image
  app.post(
    "/api/v1/post/:postId/upload/cover",
    [authMiddleware.verifyToken, uploadMiddleware.imageUpload],
    postController.updateCoverImage
  );
};