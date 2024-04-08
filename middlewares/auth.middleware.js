// Importing from modules
const jwt = require("jsonwebtoken");

// Importing within the app
const { tokenUtil } = require('../utils');
const { userValidator } = require('../validators');

// Database imports
const db = require("../models");
const { User } = db;

const checkDuplicateEmail = async (req, res, next) => {
  // Get user data from request body
  const payload = req.body;

  try {
    const validatedData = await userValidator.validateUserData(payload);

    // console.log(validatedData);

    // Add the validated data to the request object for the next() function
    req.reg_data = validatedData;


    // Check if Username or Email is available using a single query
    try {
      const user = await User.findOne({
        where: {
          email: validatedData.email
        }
      });

      // console.log(user);

      if (user) {
        return res.status(409).send({
          success: false,
          message: "Failed! User with similar email is already exits!"
        });
      }

      // Call next function to proceed with data processing
      next();
    }
    catch (error) {
      console.log(error)
      return res.status(500).send({
        success: false,
        message: "An error occurred while trying to add the user!"
      });
    }

  }
  catch (error) {
    // console.log(error);
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }

};

// Middleware to verify token(JWT)
const verifyToken = async (req, res, next) => {

  // Get jwt token from cookies or headers
  let token = req.cookies['x-access-token'] || req.headers["x-access-token"]

  // If not token is found in the headers/cookies - return 403(Forbidden)
  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No token provided!"
    })
  }

  try {
    // Save user claims to request object
    req.user = await tokenUtil.verifyToken();
    next();
  }
  catch (error) {
    // If not token verification fails - return 401(Unauthorized)
    return res.status(401).send({
      success: false,
      message: "Unauthorized!"
    });
  }
};

module.exports = {
  checkDuplicateEmail,
  verifyToken
};