// import all users controllers and export them
const { register, checkIfEmailExits, getAuthorContact, fetchRecommendedUsers } = require('./base');
const { followUser } = require('./action');
const {
  updateProfileBio, updateProfileContact, updateProfileName,
  updateProfilePassword, updateProfilePicture, updateProfileEmail
} = require('./edit');

const {
  getPerson, getUserReplies, getUserFollowers, getUserFollowing, getAccount, fetchUser
} = require('./public')

const notificationsController = require('./notifications');

// Export all users controllers
module.exports = {
  register, checkIfEmailExits, followUser, getAuthorContact,
  updateProfileBio, updateProfileContact, updateProfileName,
  updateProfilePassword, updateProfilePicture, updateProfileEmail,
  getPerson, getUserReplies, getUserFollowers, getUserFollowing,
  fetchRecommendedUsers, getAccount, fetchUser,
  notifications: notificationsController
}