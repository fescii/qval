// Import all reply queries from storyQueries
const { addReply, editReply, removeReply } = require('../../queries').storyQueries;

/**
 * @function createReply
 * @description Controller for creating a reply to a story
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const createReply = async (req, res, next) => {
  // Check if the user or payload is available
  const { hash } = req.params;

  if (!req.reply) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.reply;
  // add author & parent to the data
  data.author = req.user.hash;
  data.parent = hash.toUpperCase();

  // Add story to the database
  const {
    reply,
    error
  } = await addReply(data);

  // Passing the error to error middleware
  if (error) {
    console.log('eRR:', error)
    return next(error);
  }

  // Return the response
  return res.status(201).send({
    success: true,
    reply: reply,
    message: "Reply was added successfully!",
  });
}

/**
 * @function updateReply
 * @description Controller for updating a reply to a story
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const updateReply = async (req, res, next) => {
  // Check if the user or payload is available
  const { hash } = req.params;


  if (!req.reply || !hash) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.reply;
  // add author & hash to the data
  data.author = req.user.hash;
  data.hash = hash.toUpperCase();

  // Add story to the database
  const {
    reply,
    error
  } = await editReply(data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Return the response
  return res.status(201).send({
    success: true,
    reply: reply,
    message: "Reply was updated successfully!",
  });
}


/**
 * @function deleteReply
 * @description Controller for deleting a reply
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const deleteReply = async (req, res, next) => {
  // Check if the params is available
  const { hash } = req.params;

  if (!req.user || !hash) {
    const error = new Error('Params data or payload is undefined!');
    return next(error)
  }

  const data = {
    hash: hash.toUpperCase(),
    author: req.user.hash
  }

  // Remove the story
  const {
    deleted,
    error
  } = await removeReply(data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Check if story was not found
  if (!deleted) {
    // Return the 404 response
    return res.status(404).send({
      success: false,
      message: "Reply you are trying to delete was not found!"
    });
  }

   // Return success response
   return res.status(200).send({
    success: true,
    story: story,
    message: "Reply was deleted successfully!",
  });
}


module.exports = {
  createReply, updateReply, deleteReply
}