// Importing within the app
const { addTopic, editTopic, removeTopic, findTopic, findTopicsByQuery } = require('../../queries').topicQueries;
const { validateTopic } = require('../../validators').topicValidator;

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
  if (!req.user || !req.topic) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.topic;

  const {
    topic,
    error
  } = await addTopic(req.user, data);

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
  // Check if the user or payload is available
  if (!req.body || !req.user || !req.params) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }
  const { hash } = req.params;

   // validate the topic data 
   const valObj = await validateTopic(req.body);

  // If there is an error, return the error
  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  const {
    topic,
    error
  } = await editTopic(hash.toUpperCase(), valObj.data);

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
  let hash = req.params.hash;

  // change the hash to uppercase
  hash = hash.toUpperCase();

  const {
    deleted,
    error
  } = await removeTopic(hash);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  if(!deleted){
    return res.status(404).send({
      success: false,
      message: "The topic you're trying to delete was not found!"
    });
  }

  // Handling when the topic was deleted
  return res.status(200).send({
    success: true,
    message: `Topic - ${hash} was deleted successfully!`
  });
};

/**
 * @function searchTopics
 * @description Controller for getting topics by query
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const searchTopics = async (req, res, next) => {
  // Get the query parameter: such as ...t/search?q=topic
  let query = req.query.q;

  // Check if the query is available
  if (!query) {
    // Return a 400 status code and a message
    return res.status(400).send({
      success: false,
      message: "Query parameter is required!"
    });
  }
  

  const {
    topics,
    error
  } = await findTopicsByQuery(query);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  if(!topics){
    return res.status(404).send({
      success: false,
      message: "No topic matched the query!"
    });
  }

  // Handling when the topic was found
  return res.status(200).send({
    success: true,
    topics: topics,
    message: `Topics were found successfully!`
  });
};

/**
 * @function getTopicByHash
 * @description Controller for getting a topic by hash
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const getTopicByHash = async (req, res, next) => {
  // Get the hash parameter
  let hash = req.params.hash;

  // Check if the hash is available
  if (!hash) {
    // Return a 400 status code and a message
    return res.status(400).send({
      success: false,
      message: "Topic parameter was not provided!"
    });
  }

  // change the hash to uppercase
  hash = hash.toUpperCase();

  const {
    topic,
    error
  } = await findTopic(hash);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  if(!topic){
    return res.status(404).send({
      success: false,
      message: "The topic you're trying to get was not found!"
    });
  }

  // Handling when the topic was found
  return res.status(200).send({
    success: true,
    topic,
    message: `Topic - ${hash} was found successfully!`
  });
};

/**
 * Exporting all controllers as a single object
*/
module.exports = {
  createTopic, updateTopic, deleteTopic,
  searchTopics, getTopicByHash
}