// Importing from modules
const bcrypt = require("bcryptjs");

// Importing within the app
const { jwt_expiry } = require('../configs').envConfig;
const { tokenUtil } = require('../utils');
const { validateLoginData, validateEmail } = require('../validators').userValidator;
const { generateRandomToken } = require('../utils').mailUtil;

const {
  addUser, checkIfUserExits,
  addOrEditCode, verifyCode
} = require('../queries').authQueries;

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
      username: user.username,
      email: user.email
    },
    message: "User was registered successfully!"
  });
};


/**
 * @function signIn
 * @description Controller to login a user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
const signIn = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.body) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // Get payload from request body
  const payload = req.body;

  const {
    data,
    error
  } =  await validateLoginData(payload);

  // If validation returns an error
  if (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }

  // Check if user with that email exists
  const {
    user,
    err
  } = await checkIfUserExits(data.email)

  // Passing the error to error middleware
  if (err) {
    return next(err);
  }

  // If no user is found, return 404(Not found)
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "No user found using that email address!"
    });
  }

  // Compare passwords
  let passwordIsValid = bcrypt.compareSync(
    data.password,
    user.password
  );

  // If passwords do not match return 401(Unauthorized)
  if (!passwordIsValid) {
    return res.status(401).send({
      success: false,
      message: "Password is incorrect!"
    });
  }

  let token = await tokenUtil.generateToken({
    id: user.id, email: user.email,
    username: user.username, name: user.name
  })

  // Add cookie to the response object
  let options = {
    maxAge: jwt_expiry,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  }

  // Set cookie
  res.cookie('x-access-token', token, options) // options is optional


  return res.status(200).send({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      username: user.username
    },
    accessToken: token,
    message: "You're logged in successful!"
  });
}


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
 * Exporting all controllers
*/
module.exports = {
  signUp, signIn, checkIfEmailExits, forgotPassword, verifyUserCode
}