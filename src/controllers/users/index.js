// import all users controllers and export them
const { register, checkIfEmailExits } = require('./base.user');
const { followUser } = require('./action.user');

// Export all users controllers
module.exports = {
  register, checkIfEmailExits, followUser
}