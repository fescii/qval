// import all auth controllers and export them
const { login } = require('./base.auth');
const { forgotPassword, resetPassword, verifyUserCode } = require('./recover.auth');


// Export all auth controllers
module.exports = {
  login, forgotPassword, resetPassword, verifyUserCode
}