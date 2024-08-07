// Story all routes

const { checkToken } = require('../../middlewares').authMiddleware;

const {
  findAuthorStories, findAuthorReplies, getTopicStories, getRelatedStories,
  getStoryReplies, getReplyReplies, fetchReplyLikes, fetchStoryLikes,
  findUserFollowers, findUserFollowing, getTopicContributors
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
  app.get(`${url}/u/:hash/stories`, checkToken, findAuthorStories);

  // Route for finding all replies by an author
  app.get(`${url}/u/:hash/replies`, checkToken, findAuthorReplies);

  // Route for finding all followers of a user
  app.get(`${url}/u/:hash/followers`, checkToken, findUserFollowers);

  // Route for finding all users a user is following
  app.get(`${url}/u/:hash/following`, checkToken, findUserFollowing);

  // Route for finding all stories by a topic
  app.get(`${url}/t/:slug/stories`, checkToken, getTopicStories);

  // Route for finding all contributors to a topic
  app.get(`${url}/t/:hash/contributors`, checkToken, getTopicContributors);

  // Route for finding related stories
  app.get(`${url}/t/feeds/related`, checkToken, getRelatedStories);
  
  // Route to handle finding all story replies
  app.get(`${url}/p/:hash/replies`, checkToken, getStoryReplies)

  // Route to handle finding all reply replies
  app.get(`${url}/r/:hash/replies`, checkToken, getReplyReplies);

  // Route to handle finding all story likes
  app.get(`${url}/p/:hash/likes`, checkToken, fetchStoryLikes);

  // Route to handle finding all reply likes
  app.get(`${url}/r/:hash/likes`, checkToken, fetchReplyLikes);
}