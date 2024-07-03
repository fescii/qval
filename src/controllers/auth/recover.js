// import required validation functions
const {
  validateEmail
} = require('../../validators').userValidator;

// import required queries
const {
  addOrEditCode,
  verifyCode,
  editPassword
} = require('../../queries').authQueries;

const { checkIfUserExits } = require('../../queries').userQueries;

// import required utility functions
const { generateRandomToken } = require('../../utils').mailUtil;



/**
 * @function forgotPassword
 * @description A controller function to handle password reset
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const forgotPassword = async (req, res, next) => {
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

  // If no user is found, return 404(Not found)
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "No user found using that email address!"
    });
  }

  // Generate a token
  const token = await generateRandomToken(6);

  // Save the token to the database
  const addedData = await addOrEditCode({
    email: user.email,
    code: token
  });

  // If error is not equal to undefined throw an error
  if (addedData.error) {
    return next(addedData.error);
  }

  // Send success response to the user
  return res.status(200).send({
    success: true,
    user: {
      email: user.email,
      username: user.username,
      name: user.name
    },
    message: "Password reset token has been sent to your email address."
  });
}

/**
 * @function verifyCode
 * @description A controller function to verify a code
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const verifyUserCode = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.body) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // Get payload from request body
  const payload = req.body;

  // If validation returns an error
  if (!payload.token || !payload.email) {
    return res.status(400).send({
      success: false,
      message: 'Email or code is missing!'
    });
  }

  // Very if the code is valid
  const isValid = await verifyCode(payload.email, payload.token);

  // If code is not valid
  if (!isValid) {
    return res.status(400).send({
      success: false,
      message: 'The code is invalid or has expired!'
    });
  }

  // Send success response to the user
  return res.status(200).send({
    success: true,
    message: "Code is valid!"
  });
}

/**
 * @function resetPassword
 * @description A controller function to reset a password
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const resetPassword = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.body) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // Get payload from request body
  const payload = req.body;

  // If validation returns an error
  if (!payload.email || !payload.password) {
    return res.status(400).send({
      success: false,
      message: 'Email, or password is missing!'
    });
  }

  // Update the password
  const updatedData = await editPassword(payload.email, payload.password);

  // If error is not equal to undefined throw an error
  if (updatedData.error) {
    return next(updatedData.error);
  }

  // Send success response to the user
  return res.status(200).send({
    success: true,
    user: {
      email: updatedData.user.email,
      username: updatedData.user.username,
      name: updatedData.user.name
    },
    message: "Password has been reset successfully!"
  });
}

module.exports = {
  forgotPassword,
  verifyUserCode,
  resetPassword
};