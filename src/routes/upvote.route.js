// Import controllers and middlewares
const { verifyToken } = require('../middlewares').authMiddleware;
const { upvoteStory, likeOpinion } = require('../controllers').upvoteController;


// Function to export all upvote routes
module.exports = (app, url) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  // Route for handling story upvotes
  app.post(`${url}/s/:storyHash/upvote`,
    verifyToken,
    upvoteStory
  );

  // Route for handling opinion likes
  app.post(`${url}/o/:opinionHash/like`,
    verifyToken,
    likeOpinion
  );
}