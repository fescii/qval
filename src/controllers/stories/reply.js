// Import all reply queries from storyQueries
const { addReply, editReply, removeReply } = require('../../queries').storyQueries;

const { addActivity } = require('../../bull');

/**
 * @function createStoryReply
 * @description Controller for creating a reply to a story
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const createStoryReply = async (req, res, next) => {
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
  data.story = hash.toUpperCase();
  data.kind = "story";

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

  // Add activity to the queue
  await addActivity({
    kind: 'reply', action: 'reply', author: req.user.hash, name: req.user.name,
    target: reply.story, to: null, verb: 'replied',
    type: 'story', nullable: false
  });

  // Return the response
  return res.status(201).send({
    success: true,
    reply: reply,
    message: "Reply was added successfully!",
  });
}

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
  data.reply = hash.toUpperCase();
  data.kind = "reply";

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

  // Add activity to the queue
  await addActivity({
    kind: 'reply', action: 'reply', author: req.user.hash, name: req.user.name,
    target: reply.reply, to: null, verb: 'replied',
    type: 'reply', nullable: false
  });

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

  // If no reply was found
  if (!reply){
    return res.status(404).send({
      success: false,
      message: "The reply you are trying to update was not found!",
    });
  }

  // Add activity to the queue
  await addActivity({
    kind: 'reply', action: 'update', author: req.user.hash, name: req.user.name,
    target: reply.hash, to: null, verb: 'updated reply content',
    nullable: true
  });

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
    deleted: deleted,
    message: "Reply was deleted successfully!",
  });
}


module.exports = {
  createReply, updateReply, deleteReply,
  createStoryReply
}