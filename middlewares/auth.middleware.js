// Importing within the app
const { tokenUtil } = require('../utils');
const { userValidator } = require('../validators');

// Database imports
const { dbConfig } = require('../configs');
const supabase = dbConfig.supabase;


const checkDuplicateEmail = async (req, res, next) => {
  // Get user data from request body
  const payload = req.body;

  try {
    const userData = await userValidator.registrationValidation(payload);

    // Add the validated data to the request object for the next() function
    req.regData = userData;

    // Retrieve a list of all users in your Supabase project
    // const { data, error } = await supabase.auth.api.getUserByEmail(userData.email);

    const { data, error } = await supabase.rpc( "get_user_id_by_email",
      {
        email: userData.email,
      }
    );

    if (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "An error occurred while trying to add the user!"
      });
    }

    // Check if any result was returned
    if (data.length > 0) {
      // console.log(data);
      return res.status(409).send({
        success: false,
        message: "Failed! Email is already in use!"
      });
    }
    else {
      // Proceed with the processing
      next();
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
    // console.log(token);
    let user = await tokenUtil.verifyToken(token);

    // console.log(user);

    // Save user claims to request object
    req.user = user;
    next();
  }
  catch (error) {
    console.error(error);
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