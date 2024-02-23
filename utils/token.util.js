const jwt = require("jsonwebtoken");

const { authConfig } = require('../configs')


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
  verifyToken
}