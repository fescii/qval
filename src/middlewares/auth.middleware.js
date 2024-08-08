// Importing within the app
const { validateToken } = require('../utils').tokenUtil;
const { validateUser } = require('../validators').userValidator;
const { checkIfUserExits } = require('../queries').userQueries;


/**
 * @function checkDuplicateEmail
 * @description - Middleware to check if user with similar email exists
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
const checkDuplicateEmail = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.body) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // Get user data from request body
  const payload = req.body;

  const valueObj = await validateUser(payload);

  // Handling data validation error
  if (valueObj.error) {
    return res.status(400).send({
      success: false,
      message: valueObj.error.message
    });
  }

  const {
    user,
    error
  } = await checkIfUserExits(valueObj.data.email);

  // Passing the error to error middleware
  if (error) {
    console.log('This error segment runs')
    return next(error);
  }

  if (user) {
    return res.status(409).send({
      success: false,
      message: "Failed! User with similar email is already exits!"
    });
  }

  // Call next function to proceed with data processing
  req.reg_data = valueObj.data;
  next();
};

/**
 * @function verifyToken
 * @description - Middleware to verify token(JWT) and add user to the request object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
// Middleware to verify token(JWT)
const verifyToken = async (req, res, next) => {

  // Get jwt token from cookies or headers
  let token = req.cookies['x-access-token'] || req.headers["x-access-token"]

  // If not, token is found in the headers/cookies - return 403(Forbidden)
  if (!token) {
    return res.status(403).send({
      success: false,
      unverified: true,
      message: "You are not authorized!, login to continue"
    })
  }

  const {
    user,
    error
  } = await validateToken(token);

  // If error is returned
  if(error) {
    return res.status(401).send({
      success: false,
      unverified: true,
      message: "Unauthorized!, please login to continue!"
    });
  }

  // Add user to the request object
  req.user = user;
  next();
};


/**
 * @function verifyLogin
 * @description - Middleware to verify token(JWT) and add user to the request object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
// Middleware to verify token(JWT)
const verifyLogin = async (req, res, next) => {

  // Get jwt token from cookies or headers
  let token = req.cookies['x-access-token'] || req.headers["x-access-token"]

  // If not, token is found in the headers/cookies - return 403(Forbidden)
  if (!token) {
    return res.redirect('/join/login');
  }

  const {
    user,
    error
  } = await validateToken(token);

  // If error is returned
  if(error) {
    return res.redirect('/join/login');
  }

  // Add user to the request object
  req.user = user;
  next();
};

/**
 * @function checkToken
 * @description - Middleware to verify token(JWT) and add user to the request object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
// Middleware to verify token(JWT)
const checkToken = async (req, res, next) => {

  // Get jwt token from cookies or headers
  let token = req.cookies['x-access-token'] || req.headers["x-access-token"]

  // If not, token is found in the headers/cookies - return 403(Forbidden)
  if (!token) {
    // add null user to the request object
    req.user = {
      hash: null,
      email: null,
      name: null
    };

    return next();
  }

  const {
    user,
    error
  } = await validateToken(token);

  // If error is returned
  if(error) {
    return res.status(401).send({
      success: false,
      unverified: true,
      message: "Unauthorized!, please login to continue!"
    });
  }

  // Add user to the request object
  req.user = user;
  return next();
};


// Exporting all the middlewares as a single object
module.exports = {
  checkDuplicateEmail,
  verifyToken, checkToken,
  verifyLogin
};