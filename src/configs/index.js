// Importing and exporting all configs
const mpesaConfig = require('./mpesa.config');
const storageConfig = require('./storage.config');
const { envConfig, mapRequestMethod} = require('./env.config');
const hashConfig = require('./hash.config');
const platformConfig = require('./platform.config');
const mailConfig = require('./mail.config');

module.exports = {
  mpesaConfig, storageConfig, envConfig, mapRequestMethod,
  hashConfig, platformConfig, mailConfig
};