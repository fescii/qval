// import models
const { sequelize, User} = require('../../models').models;

// import bcrypt
const bcrypt = require('bcrypt');

// import hashConfig
const {hashConfig} = require("../../configs");

// import gen_hash
const { gen_hash } = require("../../wasm");

/**
 * @function addUser
 * @description Query to add a new user
 * @param {Object} data - The user data
 * @param {String} data.first_name - The first name of the user
 * @param {String} data.last_name - The last name of the user
 * @param {String} data.email - The email of the user
 * @param {String} data.password - The password of the user
 * @returns {Object} - The user object or null, and the error if any
*/
const addUser = async (data) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Trying to create new user to the database
    const user = await User.create({
      username: data.username,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      password: bcrypt.hashSync(data.password, 8)
    }, {transaction})

    // Generate the username - hash
    const {
      hash,
      error
    } = await gen_hash(hashConfig.user, user.id.toString());

    // If error is not equal to undefined throw an error
    if (error) {
      throw error;
    }

    // Else set the username to the hash
    user.username = hash;

    await user.save({transaction});

    await transaction.commit();

    // On success return data
    return { user: user, error: null}
  } catch (err) {
    // console.log(err)
    await transaction.rollback();
    return { user: null, error: err}
  }
}


/**
 * @function checkIfUserExits
 * @description Query to check if a user exists
 * @param {String} email - The email of the user
 * @returns {Object} - The user object or null, and the error if any
*/
const checkIfUserExits = async email => {
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    return { user, error: null };
  }
  catch (error) {
    return { user: null, error };
  }
}


// Export the queries
module.exports = {
  addUser,
  checkIfUserExits
};