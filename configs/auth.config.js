authConfig = {
  secret: process.env['AUTH_SECRET'],
  jwt_expiry: process.env['JWT_EXPIRY'],
  hash_secret: process.env['HASH_SECRET']
};

module.exports = authConfig;