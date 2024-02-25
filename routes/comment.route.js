const { commentController } = require('../controllers');
const { authMiddleware, uploadMiddleware } = require('../middlewares');

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	// Endpoint for creating a comment
	app.put(
		"/api/v1/post/:postId/comment/add",
		commentController.createComment
	);

	// Endpoint for creating a reply
	app.put(
		"/api/v1/comment/:commentId/reply/add",
		commentController.createReply
	);

	// Endpoint for deleting a comment
	app.delete(
		"/api/v1/comment/:commentId/delete",
		authMiddleware.verifyToken,
		commentController.deleteComment
	);

	// Endpoint for deleting a reply
	app.delete(
		"/api/v1/reply/:replyId/delete",
		authMiddleware.verifyToken,
		commentController.deleteReply
	);
};