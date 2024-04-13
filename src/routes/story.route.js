// Story all routes

const { storyController } = require('../controllers');
const { storyMiddleware, authMiddleware } = require('../middlewares');

// Function to export all story routes
module.exports = (app, url) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Creating a new story
  app.put(`${url}/add`,
    [authMiddleware.verifyToken, storyMiddleware.checkDuplicateStory],
    storyController.createStory
  );
}