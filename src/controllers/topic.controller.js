// Importing within the app
const { validateTopicData } = require('../validators').topicValidator;
const { Privileges } = require('../configs').platformConfig;
const { checkAuthority } = require('../utils').roleUtil;
const { addTopic, editTopic, removeTopic } = require('../queries').topicQueries;


/**
 * @function createTopic
 * @description Controller for creating a new topic
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const createTopic = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.topic_data || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.topic_data;
  const userHash = req.user.hash;

  const {
    topic,
    error
  } = await addTopic(userHash, data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  return res.status(201).send({
    success: true,
    topic: {
      author: topic.author,
      name: topic.name,
      slug: topic.slug,
      hash: topic.hash,
      about: topic.about
    },
    message: "Topic was created successfully!"
  });
};


/**
 * @function updateTopic
 * @description Controller for updating a topic by hash
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateTopic = async (req, res, next) => {
  // Check if the user or payload is available
  const { topicHash } = req.params;

  if (!req.body || !topicHash || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // get user id
  const userId = req.user.id;

  const topicData = await validateTopicData(req.body);

  // Handling data validation error
  if (topicData.error) {
    return res.status(400).send({
      success: false,
      message: topicData.error.message
    });
  }

  // Create access data - (For authorizing user)
  const access = {
    section: topicHash,
    privilege: Privileges.Update,
    user: userId,
    key: 'action'
  }

  // Check if the user has access to perform the action
  const hasAccess = await checkAuthority(access);

  // If user is not authorized return unauthorized
  if (!hasAccess) {
    return res.status(401).send({
      success: false,
      message: "You are not authorized to update this topic!"
    });
  }

  const {
    topic,
    error
  } = await editTopic(topicHash, topicData.data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Handling when the topic is not found
  if (!topic) {
    return res.status(404).send({
      success: false,
      message: "The topic you're trying to update was not found!"
    });
  }

  return res.status(200).send({
    success: true,
    topic: {
      author: topic.author,
      name: topic.name,
      slug: topic.slug,
      hash: topic.hash,
      about: topic.about
    },
    message: "Topic was updated successfully!"
  });
};


/**
 * @function deleteTopic
 * @description Controller for deleting a topic by hash
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const deleteTopic = async (req, res, next) => {
  // Check if the user or payload is available
  const { topicHash } = req.params;

  // get user id
  const userId = req.user.id;

  // Create access data - (For authorizing user)
  const access = {
    section: topicHash,
    privilege: Privileges.Delete,
    user: userId,
    key: 'action'
  }

  const isAuthorized = await checkAuthority(access);

  if (isAuthorized){
    const {
      deleted,
      error
    } = await removeTopic(topicHash);

    // Passing the error to error middleware
    if (error) {
      return next(error);
    }

    if(!deleted){
      const error = new Error('Something went insanely wrong!');
      return next(error)
    }

    // Handling when the topic was deleted
    return res.status(200).send({
      success: true,
      message: `Topic - ${topicHash} was deleted successfully!`
    });
  }
  else {
    return res.status(401).send({
      success: false,
      message: "You are not authorize to perform this action!"
    });
  }
};

/**
 * Exporting all controllers as a single object
*/
module.exports = {
  createTopic, updateTopic, deleteTopic
}