authConfig = {
  secret: process.env['AUTH_SECRET'],
  jwt_expiry: process.env['JWT_EXPIRY']
};

module.exports = authConfig;