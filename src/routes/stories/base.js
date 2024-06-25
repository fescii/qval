// Story all routes

const { verifyToken } = require('../../middlewares').authMiddleware;
const {
  checkContent, checkStory, checkTitle, checkSlug,
  checkSection, checkSectionContent
} = require('../../middlewares').storyMiddleware;
const {
  createStory, deleteStory, updateSlug, updateTitle, updateStory, publishAStory,
  checkStoryBySlug, createStorySection, updateStorySection, deleteStorySection
} = require('../../controllers').storyController;


/**
 * @function storyRoutes
 * @description a modular function that registers all the story routes
 * @param {Object} app - The express app
 * @param {String} url - The base url, usually '/api/v1' or '/api/v1/s'
 * @returns {void}
*/
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
    [verifyToken, checkStory],
    createStory
  );

  // Route for handling publishing a story
  app.patch(`${url}/:hash/publish`,
    verifyToken, publishAStory
  );

  // Route for handling updating story content
  app.patch(`${url}/:hash/edit`,
    [verifyToken, checkContent],
    updateStory
  );

  // Route for handling updating story title
  app.patch(`${url}/:hash/edit/title`,
    [verifyToken, checkTitle],
    updateTitle
  );

  // Route for handling updating story slug
  app.patch(`${url}/:hash/edit/slug`,
    [verifyToken, checkSlug],
    updateSlug
  );

  // Route for handling story removal/deletion
  app.delete(`${url}/:storyHash/remove`,
    verifyToken, deleteStory
  );

  // Route for checking if story exists by slug
  app.get(`${url}/check`,
    checkStoryBySlug
  );

  // Route for handling creation of story section
  app.put(`${url}/:hash/section/add`,
    [verifyToken, checkSection],
    createStorySection
  );

  // Route for handling updating story section content
  app.patch(`${url}/:hash/section/edit`,
    [verifyToken, checkSectionContent],
    updateStorySection
  );

  // Route for handling story section removal/deletion
  app.delete(`${url}/:hash/section/remove`,
    verifyToken, deleteStorySection
  );
}