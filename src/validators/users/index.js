// Import and export all users validators
const {validateLogin, validateUser} = require('./base.user');
const {
  validateBio, validateContact, validateEmail,
  validateName, validatePassword
} = require('./info.user');


module.exports = {
  validateLogin, validateUser, validateBio,
  validateContact, validateEmail,
  validateName, validatePassword
};