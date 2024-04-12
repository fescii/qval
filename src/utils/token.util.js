const jwt = require("jsonwebtoken");
const { envConfig } = require('../configs')

//Function for generating jwt token
const generateToken = async (userClaims) => {
  // console.log(envConfig.jwt_expiry);
  return jwt.sign({ user: userClaims }, envConfig.secret, {
    expiresIn: envConfig.jwt_expiry
  });
}

//Function for verifying jwt token
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