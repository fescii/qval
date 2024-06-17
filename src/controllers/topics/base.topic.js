// Importing within the app
const { addTopic, editTopic, removeTopic } = require('../../queries').topicQueries;

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
  if (!req.topic) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.topic;
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
    topic,
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
  const { hash } = req.params;
  const topicData = req.topic;

  const {
    topic,
    error
  } = await editTopic(hash, topicData);

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
    topic,
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
  const { hash } = req.params;

  const {
    deleted,
    error
  } = await removeTopic(hash);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  if(!deleted){
    const error = new Error('Topic was not found!');
    return next(error);
  }

  // Handling when the topic was deleted
  return res.status(200).send({
    success: true,
    message: `Topic - ${hash} was deleted successfully!`
  });
};

/**
 * Exporting all controllers as a single object
*/
module.exports = {
  createTopic, updateTopic, deleteTopic
}