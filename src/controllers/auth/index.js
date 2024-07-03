// import all auth controllers and export them
const { signin } = require('./base');
const { forgotPassword, resetPassword, verifyUserCode } = require('./recover');
const { join, login, register, recover } = require('./public')

// Export all auth controllers
module.exports = {
  login, forgotPassword, resetPassword, verifyUserCode,
  join, register, recover, signin
}