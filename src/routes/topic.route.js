const { verifyToken } = require('../middlewares').authMiddleware;
const {
  createTopic, updateTopic, deleteTopic,
  createDraft, createTopicSection, updateDraft,
  updateTopicSection, deleteDraft, deleteTopicSection,
  acceptDraft
} = require('../controllers').topicController;

const {
  checkDuplicateTopic, checkTopicActionPrivilege
} = require('../middlewares').topicMiddleware;

/**
 * @function topicRoutes
 * @description a modular function that registers all the topic routes
 * @param {Object} app - The express app
 * @param {String} url - The base url, usually '/api/v1' or '/api/v1/t'
*/
module.exports = (app, url) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Creating a new topic
  app.put(`${url}/add`,
    [verifyToken, checkDuplicateTopic],
    createTopic
  );

  // Updating existing topic
  app.patch(`${url}/:hash/edit`,
    [verifyToken, checkTopicActionPrivilege],
    updateTopic
  );

  // Deleting an existing topic
  app.delete(`${url}/:hash/remove`,
    [verifyToken, checkTopicActionPrivilege],
    deleteTopic
  );

  // creating a new topic section
  app.put(`${url}/:hash/section/add`,
    [verifyToken, checkTopicActionPrivilege],
    createTopicSection
  );

  // updating a topic section
  app.patch(`${url}/:hash/section/edit`,
    [verifyToken, checkTopicActionPrivilege],
    updateTopicSection
  );

  // deleting a topic section
  app.delete(`${url}/:hash/section/remove`,
    [verifyToken, checkTopicActionPrivilege],
    deleteTopicSection
  );

  // creating a new draft
  app.put(`${url}/:hash/draft/add`,
    verifyToken, createDraft
  );

  // updating a draft
  app.patch(`${url}/:hash/draft/edit`,
    verifyToken, updateDraft
  );

  // deleting a draft
  app.delete(`${url}/:hash/draft/remove`,
    [verifyToken, checkTopicActionPrivilege],
    deleteDraft
  );

  // accepting a draft
  app.patch(`${url}/:hash/draft/merge`,
    [verifyToken, checkTopicActionPrivilege],
    acceptDraft
  );
};