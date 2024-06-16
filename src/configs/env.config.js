const envConfig = {
  secret: process.env['AUTH_SECRET'],
  jwt_expiry: parseInt(process.env['JWT_EXPIRY']),
  // set cookie to expire after 30 days
  cookie_age: 30 * 24 * 60 * 60 * 1000,
  hash_secret: process.env['HASH_SECRET'],
  salt_rounds: 10,
  node_env: process.env['NODE_ENV'],
  port: process.env['PORT'],
  host: process.env['HOST']
};

module.exports = envConfig;