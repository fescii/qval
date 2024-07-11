// Import base user queries
const { addUser, checkIfUserExits, findAuthorContact, getRecommendedUsers } = require('../../queries').userQueries;

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

/**
 * @function getAuthorContact
 * @description Controller to get author contact details
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object || pass the error to the next middleware
*/
const getAuthorContact = async (req, res, next) => {
  // Get the author hash from the request params
  const { hash } = req.params;

  // Get the author contact details
  const {
    contact,
    error
  } = await findAuthorContact(hash.toUpperCase());

  // If error is not equal to undefined throw an error
  if (error) {
    return next(error);
  }

  return res.status(200).send({
    success: true,
    contact,
    message: "Contact details found!"
  });
}

/**
 * @function fetchRecommendedUsers
 * @description Controller to fetch 5 recommended users
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object || pass the error to the next middleware
*/
const fetchRecommendedUsers = async (req, res, next) => {
  // Get the hash from the request object
  const user = req.user;

  let hash = null;

  // if user is defined, get the hash
  if (user) {
    hash = user.hash;
  }

  // Get the recommended users
  const {
    people,
    error
  } = await getRecommendedUsers(hash);

  // If error is not equal to undefined throw an error
  if (error) {
    return next(error);
  }

  // if recommended users are not found
  if(people.length === 0) {
    return res.status(404).send({
      success: false,
      people,
      message: "Recommended users not found!"
    });
  }

  return res.status(200).send({
    success: true,
    people,
    message: "Recommended users found!"
  });
}


module.exports = {
  register, getAuthorContact,
  checkIfEmailExits, fetchRecommendedUsers
};