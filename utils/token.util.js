const jwt = require("jsonwebtoken");

const { authConfig } = require('../configs')

//Function for generating jwt token
const generateToken = async (userClaims) => {
  return jwt.sign({ user: userClaims }, authConfig.secret, {
    expiresIn: authConfig.jwt_expiry
  });
}

//Function for verifying jwt token
const verifyToken = async () => {
  jwt.verify(token, authConfig.secret, (err, decoded) => {
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