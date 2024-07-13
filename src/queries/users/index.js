// Import all the queries from the users and export them
const {
  editBio, editContact, editPassword,
  editEmail, editName, editPicture
} = require('./edit');
const { connectToUser } = require('./action');
const { addUser, checkIfUserExits, getUserByHash , findAuthorContact, getUserProfile } = require('./base');
const { getRecommendedUsers } = require('./top');
const profileQueries = require('./profile');
const notificationQueries = require('./notifications');
const activityQueries = require('./activities');

module.exports = {
  editBio, editContact, editPassword, getRecommendedUsers,
  editEmail, editName, editPicture, getUserByHash,
  connectToUser, addUser, checkIfUserExits, findAuthorContact,
  getUserProfile, profile: profileQueries, notifications: notificationQueries,
  activities: activityQueries
};