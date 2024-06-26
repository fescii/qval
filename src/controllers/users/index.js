// import all users controllers and export them
const { register, checkIfEmailExits } = require('./base');
const { followUser } = require('./action');
const {
  updateProfileBio, updateProfileContact, updateProfileName,
  updateProfilePassword, updateProfilePicture, updateProfileEmail
} = require('./edit');

// Export all users controllers
module.exports = {
  register, checkIfEmailExits, followUser,
  updateProfileBio, updateProfileContact, updateProfileName,
  updateProfilePassword, updateProfilePicture, updateProfileEmail
}