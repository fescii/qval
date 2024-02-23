const { postController } = require('../controllers');
const { authMiddleware } = require('../middlewares');


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/v1/post/add",
    authMiddleware.verifyToken,
    postController.createPost
  );
};