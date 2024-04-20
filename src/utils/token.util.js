const jwt = require("jsonwebtoken");
const { envConfig } = require('../configs')

/**
 * @function generateToken
 * @name generateToken
 * @description A utility function for generating a jwt token
 * @param {Object} userClaims - The user claims
 * @returns {String} - The jwt token
*/
const generateToken = async (userClaims) => {
  // console.log(envConfig.jwt_expiry);
  return jwt.sign({ user: userClaims }, envConfig.secret, {
    expiresIn: envConfig.jwt_expiry
  });
}

/**
 * @function validateToken
 * @name validateToken
 * @description A utility function for validating a jwt token
 * @param {String} token - The jwt token
 * @returns {Object} - The user object
*/
const validateToken = async (token) => {
  return  jwt.verify(token, envConfig.secret, (err, decoded) => {
    if (err) {
      return { user: null, error: err}
    }
    return {user: decoded.user, error: null};
  });
}

module.exports = {
  generateToken,
  validateToken
}