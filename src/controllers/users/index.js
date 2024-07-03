// import all users controllers and export them
const { register, checkIfEmailExits, getAuthorContact } = require('./base');
const { followUser } = require('./action');
const {
  updateProfileBio, updateProfileContact, updateProfileName,
  updateProfilePassword, updateProfilePicture, updateProfileEmail
} = require('./edit');

const {
  getPerson, getUserReplies, getUserFollowers, getUserFollowing
} = require('./public')

// Export all users controllers
module.exports = {
  register, checkIfEmailExits, followUser, getAuthorContact,
  updateProfileBio, updateProfileContact, updateProfileName,
  updateProfilePassword, updateProfilePicture, updateProfileEmail,
  getPerson, getUserReplies, getUserFollowers, getUserFollowing
}