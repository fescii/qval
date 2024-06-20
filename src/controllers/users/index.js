// import all users controllers and export them
const { register, checkIfEmailExits } = require('./base.user');
const { followUser } = require('./action.user');
const {
  updateProfileBio, updateProfileContact, updateProfileName,
  updateProfilePassword, updateProfilePicture, updateProfileEmail
} = require('./edit.user');

// Export all users controllers
module.exports = {
  register, checkIfEmailExits, followUser,
  updateProfileBio, updateProfileContact, updateProfileName,
  updateProfilePassword, updateProfilePicture, updateProfileEmail
}