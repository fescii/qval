// Story all routes

const { checkToken } = require('../../middlewares').authMiddleware;

const {
  findAuthorStories, findAuthorReplies, getTopicStories, getRelatedStories
} = require('../../controllers').storyController;


/**
 * @function feedsRoutes
 * @description a modular function that registers all feeds for stories
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
  
  // Route for finding all stories by an author
  app.get(`${url}/u/:hash/stories`,
    checkToken, findAuthorStories
  );

  // Route for finding all replies by an author
  app.get(`${url}/u/:hash/replies`,
    checkToken, findAuthorReplies
  );

  // Route for finding all stories by a topic
  app.get(`${url}/t/:hash/stories`,
    checkToken, getTopicStories
  );

  // Route for finding related stories
  app.get(`${url}/t/feeds/related`,
    checkToken, getRelatedStories
  );
  
}