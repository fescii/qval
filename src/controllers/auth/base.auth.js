// Importing from modules
const bcrypt = require("bcryptjs");

// Importing within the app
const { cookie_age } = require('../../configs').envConfig;
const { tokenUtil } = require('../../utils');
const { validateLogin } = require('../../validators').userValidator;

const { checkIfUserExits } = require('../../queries').userQueries;

/**
 * @function signIn
 * @description Controller to login a user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
const login = async (req, res, next) => {
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
  } =  await validateLogin(payload);

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
    maxAge: cookie_age,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  }

  // Set cookie
  res.cookie('x-access-token', token, options)


  // Return a successful response
  return res.status(200).send({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      username: user.username
    },
    accessToken: token,
    message: "You were successfully logged in!"
  });
}


/**
 * Exporting all controllers
*/
module.exports = {
  login
}