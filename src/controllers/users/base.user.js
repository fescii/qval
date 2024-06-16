// Import base user queries
const { userActionQueries, userBaseQueries, userEditQueries } = require('../../queries').userQueries;

const { addUser } = userBaseQueries;

/**
 * @function signUp
 * @description Controller to register a new user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const signUp = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.reg_data) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // Get validated payload data from request object
  const data = req.reg_data;

  // Get the user data from db;
  const {
    user,
    error
  } = await addUser(data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // On success return response to the user
  return res.status(201).send({
    success: true,
    user: {
      name: user.name,
      hash: user.hash,
      email: user.email
    },
    message: "Your account was registered successfully!"
  });
};