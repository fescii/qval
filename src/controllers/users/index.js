// import all users controllers and export them
const { signUp, checkIfEmailExits } = require('./base.user');
const { followUser } = require('./action.user');

// Export all users controllers
module.exports = {
  signUp, checkIfEmailExits, followUser
}