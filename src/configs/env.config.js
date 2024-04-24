const envConfig = {
  secret: process.env['AUTH_SECRET'],
  jwt_expiry: parseInt(process.env['JWT_EXPIRY']),
  hash_secret: process.env['HASH_SECRET'],
  node_env: process.env['NODE_ENV']
};

module.exports = envConfig;