// Importing Timestamp Function
const mpesaConfig = require('./mpesa.config');
const dbConfig = require('./db.config')
const authConfig = require('./auth.config')
const uploadConfig = require('./upload.config')


module.exports = {
  mpesaConfig: mpesaConfig,
  dbConfig: dbConfig,
  authConfig: authConfig,
  uploadConfig: uploadConfig
};