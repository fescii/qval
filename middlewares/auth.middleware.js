// Importing within the app
const { validateToken } = require('../utils').tokenUtil;
const { validateUserData } = require('../validators').userValidator;
const { checkIfUserExits } = require('../queries').authQueries;

const checkDuplicateEmail = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.body) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }
  
  // Get user data from request body
  const payload = req.body;
  
  const {
    data,
    error
  } = await validateUserData(payload);
  
  // Handling data validation error
  if (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
  
  const {
    user,
    err
  } = await checkIfUserExits(data.email);
  
  // Passing the error to error middleware
  if (err) {
    return next(err);
  }
  
  if (user) {
    return res.status(409).send({
      success: false,
      message: "Failed! User with similar email is already exits!"
    });
  }
  
  // Call next function to proceed with data processing
  req.reg_data = data;
  next();
};

// Middleware to verify token(JWT)
const verifyToken = async (req, res, next) => {

  // Get jwt token from cookies or headers
  let token = req.cookies['x-access-token'] || req.headers["x-access-token"]

  // If not, token is found in the headers/cookies - return 403(Forbidden)
  if (!token) {
    return res.status(403).send({
      success: false,
      unverified: true,
      message: "No token provided!, login to continue"
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

module.exports = {
  checkDuplicateEmail,
  verifyToken
};