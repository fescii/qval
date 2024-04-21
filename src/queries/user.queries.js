// Import all the necessary modules and dependencies
const bycrypt = require('bcrypt');
const { User, sequelize } = require('../models').models;

/**
 * @name updatePassword
 * @function updatePassword
 * @description - A function query to update the user's password
 * @param {String} password - New password of the user
 * @param {String} username - Username of the user
 * @returns {Object} - Returns the updated user object or null or error if the user is not found
*/
const updatePassword = async (password, username) => {
  // Start a transaction
  const transaction = await sequelize.transaction();
  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } }, { transaction });
    if (!user) {
      return {
        user: null,
        error: null,
      };
    }

    // hash the password using bycrypt
    const hashPassword = await bycrypt.hash(password, 8);

    // Update the user password
    user.password = hashPassword;

    // Save the user
    await user.save({ transaction });

    return {
      user,
      error: null,
    };
  }
  catch (error) {
    // console.log(error);
    await transaction.rollback();
    return {
      user: null,
      error,
    };
  }
}


/**
 * @name updateEmail
 * @function updateEmail
 * @description - A function query to update the user's email
 * @param {String} email - New email of the user
 * @param {String} username - Username of the user
 * @returns {Object} - Returns the updated user object or null or error if the user is not found
*/
const updateEmail = async (email, username) => {
  // Start a transaction
  const transaction = await sequelize.transaction();
  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } }, { transaction });
    if (!user) {
      return {
        user: null,
        error: null,
      };
    }

    // Update the user email
    user.email = email;

    // Save the user
    await user.save({ transaction });

    return {
      user,
      error: null,
    };
  }
  catch (error) {
    // console.log(error);
    await transaction.rollback();
    return {
      user: null,
      error,
    };
  }
}

/**
 * @name updateContact
 * @function updateContact
 * @description - A function query to update the user's contact
 * @param {String} contact - New contact of the user
 * @param {String} username - Username of the user
 * @returns {Object} - Returns the updated user object or null or error if the user is not found
*/
const updateContact = async (contact, username) => {
  // Start a transaction
  const transaction = await sequelize.transaction();
  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } }, { transaction });
    if (!user) {
      return {
        user: null,
        error: null,
      };
    }

    // Update the user email
    user.contact = contact;

    // Save the user
    await user.save({ transaction });

    return {
      user,
      error: null,
    };
  }
  catch (error) {
    // console.log(error);
    await transaction.rollback();
    return {
      user: null,
      error,
    };
  }
}

/**
 * @name updateBio
 * @function updateBio
 * @description - A function query to update the user's bio
 * @param {String} bio - New bio of the user
 * @param {String} username - Username of the user
 * @returns {Object} - Returns the updated user object or null or error if the user is not found
*/
const updateBio = async (bio, username) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } }, { transaction });
    if (!user) {
      return {
        user: null,
        error: null,
      };
    }

    // Update the user email
    user.bio = bio;

    // Save the user
    await user.save({ transaction });

    return {
      user,
      error: null,
    };
  }
  catch (error) {
    // console.log(error);
    await transaction.rollback();
    return {
      user: null,
      error,
    };
  }
}


const updatePicture = async (picture, username) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } }, { transaction });
    if (!user) {
      return {
        user: null,
        error: null,
      };
    }

    // Update the user email
    user.picture = picture;

    // Save the user
    await user.save({ transaction });

    return {
      user,
      error: null,
    };
  }
  catch (error) {
    // console.log(error);
    await transaction.rollback();
    return {
      user: null,
      error,
    };
  }
}


/**
 * @module userQueries
 * @description - A module that exports all the user queries
 * @returns {Object} - Returns all the user queries
 */
module.exports = {
  updatePassword,
  updateEmail,
  updateContact,
  updateBio,
  updatePicture
}