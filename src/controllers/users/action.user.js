// Import user action queries
const { connectToUser } = require('../../queries/users');

/**
 * @function followUser
 * @description Controller to follow a user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const followUser = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.body && !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // Get the user hash from the request object
  const userHash = req.user.hash;

  // Get the user hash to follow from body
  const followHash = req.body.hash;

  // If the user hash and follow hash are null
  if (!userHash && !followHash) {
    const error = new Error('User hash and follow hash are required!');
    return next(error);
  }

  // Get the user data from db;
  const {
    followed,
    error
  } = await connectToUser(userHash, followHash);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // On success return response to the user
  return res.status(201).send({
    success: true,
    followed: followed,
    message: followed ? "You are now following the user!" : "You have unfollowed the user!"
  });
};

module.exports = {
  followUser,
};