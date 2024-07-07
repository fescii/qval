// Import necessary modules, middlewares, and controllers
const {
  getStory, getStoryLikes, getReply, getReplyLikes,
  getReplyPreview, getStoryPreview
} = require('../../controllers').storyController;

const {
  checkToken
} = require('../../middlewares').authMiddleware;


/**
 * @function topicRoutes
 * @description a modular function that registers all the story routes(public) to the app
 * @param {Object} app - The express app
 * @returns {void} - No return
*/
module.exports = app => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers", "Access-Control-Allow-Origin", "Access-Control-Allow-Methods",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });


  // Route for handling story page
  app.get('/p/:story', checkToken, getStory);

  // Route for handling story replies
  app.get('/p/:story/replies', checkToken, getStory);

  // Route for handling story likes
  app.get('/p/:story/likes', checkToken, getStoryLikes);

  // Route to get a reply: handles reply page
  app.get('/r/:hash', checkToken, getReply);

  // Route to get reply likes
  app.get('/r/:hash/likes', checkToken, getReplyLikes);

  // Route to get a reply: handles reply page(replies)
  app.get('/r/:hash/replies', checkToken, getReply);

  // Route to get story preview
  app.get('/api/v1/p/:hash/preview', checkToken, getStoryPreview);

  // Route to get reply preview
  app.get('/api/v1/r/:hash/preview', checkToken, getReplyPreview);
}