// Import user action queries
const { connectToUser } = require('../../queries/users');

const { addActivity } = require('../../bull');

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
  if (!req.params && !req.user) {
    const error = new Error('Payload data is not defined in the request!');
    return next(error);
  }

  // Get the user hash from the request object
  const userHash = req.user.hash;

  // Get the user hash to follow url params
  let followHash = req.params.hash;

  // convert the follow hash to uppercase
  followHash = followHash.toUpperCase();

  // If the user hash and follow hash are null
  if (!userHash && !followHash) {
    const error = new Error('User hash and follow hash are required!');
    return next(error);
  }

  // Check if the follow hash and user hash are equal
  if (userHash === followHash) {
    return res.status(409).send({
      success: false,
      message: "You cannot follow yourself!"
    })
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

  // add activity to the queue
  if (followed) {
    addActivity({
      kind: 'user', action: 'follow', author: req.user.hash, name: req.user.name,
      to: followHash, target: followHash, verb: 'followed',
    });
  }

  // On success return response to the user
  return res.status(201).send({
    success: true,
    followed: followed,
    message: followed ? "You are now following the user!" : "You have unfollow the user!"
  });
};

module.exports = {
  followUser,
};