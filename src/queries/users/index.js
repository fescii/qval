// Impoert all the queries from the users and export them
const {
  editBio, editContact, editPassword,
  editEmail, editName, editPicture
} = require('./edit.user');
const { connectToUser } = require('./action.user');
const { addUser, checkIfUserExits, getUserByHash} = require('./base.user');

module.exports = {
  editBio, editContact, editPassword,
  editEmail, editName, editPicture, getUserByHash,
  connectToUser, addUser, checkIfUserExits
};