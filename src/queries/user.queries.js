// Import all the necessary modules and dependencies
const bcrypt = require("bcryptjs");
const { User, sequelize } = require('../models').models;

/**
 * @name editPassword
 * @function editPassword
 * @description - A function query to edit the user's password
 * @param {String} password - New password of the user
 * @param {String} username - Username of the user
 * @returns {Object} - Returns the edited user object or null or error if the user is not found
*/
const editPassword = async (password, username) => {
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

    // hash the password using bcrypt
    const hashPassword = await bcrypt.hash(password, 8);

    // edit the user password
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
 * @name editEmail
 * @function editEmail
 * @description - A function query to edit the user's email
 * @param {String} email - New email of the user
 * @param {String} username - Username of the user
 * @returns {Object} - Returns the edited user object or null or error if the user is not found
*/
const editEmail = async (email, username) => {
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

    // edit the user email
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
 * @name editContact
 * @function editContact
 * @description - A function query to edit the user's contact
 * @param {String} contact - New contact of the user
 * @param {String} username - Username of the user
 * @returns {Object} - Returns the edited user object or null or error if the user is not found
*/
const editContact = async (contact, username) => {
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

    // edit the user email
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
 * @name editBio
 * @function editBio
 * @description - A function query to edit the user's bio
 * @param {String} bio - New bio of the user
 * @param {String} username - Username of the user
 * @returns {Object} - Returns the edited user object or null or error if the user is not found
*/
const editBio = async (bio, username) => {
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

    // edit the user email
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


const editPicture = async (picture, username) => {
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

    // edit the user email
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
  editPassword,
  editEmail,
  editContact,
  editBio,
  editPicture
}