const jwt = require("jsonwebtoken");
const { envConfig } = require('../configs')

//Function for generating jwt token
const generateToken = async (userClaims) => {
  return jwt.sign({ user: userClaims }, envConfig.secret, {
    expiresIn: envConfig.jwt_expiry
  });
}

//Function for verifying jwt token
const verifyToken = async (token) => {
  jwt.verify(token, envConfig.secret, (err, decoded) => {
    if (err) {
      throw err;
    }
    return decoded.user;
  });
}

module.exports = {
  generateToken,
  verifyToken
}