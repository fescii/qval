// Import base user queries
const { addUser, checkIfUserExits } = require('../../queries').userQueries;

// Import email validator
const { validateEmail } = require('../../validators').userValidator;

/**
 * @function register
 * @description Controller to register a new user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const register = async (req, res, next) => {
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
    user: user,
    message: "Your account was registered successfully!"
  });
};

/**
 * @function checkIfUserExits
 * @description Controller to check if a user exists using the email
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkIfEmailExits = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.body) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // Get payload from request body
  const payload = req.body;

  // Validate email data from the payload
  const validatedObj = await validateEmail(payload);

  // If validation returns an error
  if (validatedObj.error) {
    return res.status(400).send({
      success: false,
      message: validatedObj.error.message
    });
  }

  // Check if user with that email exists
  const {
    user,
    error
  } = await checkIfUserExits(validatedObj.data.email)

  // If error is not equal to undefined throw an error
  if (error) {
    return next(error);
  }

  // If user is found, return conflict
  if (user) {
    return res.status(409).send({
      success: false,
      message: "Email address already exists."
    });
  }

  return res.status(200).send({
    success: true,
    message: "Email address is available."
  });
}

module.exports = {
  register,
  checkIfEmailExits
};