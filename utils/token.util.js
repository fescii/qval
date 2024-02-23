const jwt = require("jsonwebtoken");

const { authConfig } = require('../configs')


//Function for verifying jwt token
const verifyToken = async (token) => {
  const user = {};
  await jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      throw err;
    }
    user.id = decoded.sub;
    user.email = decoded.email;
    user.phone = decoded.phone;
    user.role = decoded.aud;
  });

  // console.log(user);
  return user;
}

module.exports = {
  verifyToken
}