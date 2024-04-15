// Story all routes

const { storyMiddleware, authMiddleware } = require('../middlewares');
const {
  createStory, updateStoryContent,
  updateStoryTopics, updateStoryBody,
  updateStoryTitle, updateStorySlug, deleteStory
} = require('../controllers').storyController;


// Function to export all story routes
module.exports = (app, url) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  // Route for handling creation a new story
  app.put(`${url}/add`,
    [authMiddleware.verifyToken, storyMiddleware.checkDuplicateStory],
    createStory
  );

  // Route for handling updating story content
  app.patch(`${url}/:storyHash/edit/content`,
    authMiddleware.verifyToken,
    updateStoryContent
  );

  // Route for handling updating story body
  app.patch(`${url}/:storyHash/edit/body`,
    authMiddleware.verifyToken,
    updateStoryBody
  );

  // Route for handling updating story title
  app.patch(`${url}/:storyHash/edit/title`,
    authMiddleware.verifyToken,
    updateStoryTitle
  );

  // Route for handling updating story slug
  app.patch(`${url}/:storyHash/edit/slug`,
    authMiddleware.verifyToken,
    updateStorySlug
  );

  // Route for handling updating story topics
  app.patch(`${url}/:storyHash/edit/topics`,
    authMiddleware.verifyToken,
    updateStoryTopics
  );

  // Route for handling story removal/deletion
  app.delete(`${url}/:storyHash/remove`,
    authMiddleware.verifyToken,
    deleteStory
  );
}