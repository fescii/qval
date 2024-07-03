// Impoert all the queries from the users and export them
const {
  editBio, editContact, editPassword,
  editEmail, editName, editPicture
} = require('./edit');
const { connectToUser } = require('./action');
const { addUser, checkIfUserExits, getUserByHash , findAuthorContact } = require('./base');
const { getRecommendedUsers } = require('./top');

module.exports = {
  editBio, editContact, editPassword, getRecommendedUsers,
  editEmail, editName, editPicture, getUserByHash,
  connectToUser, addUser, checkIfUserExits, findAuthorContact
};