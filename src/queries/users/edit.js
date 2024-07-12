// Import all the necessary modules and dependencies
const bcrypt = require("bcryptjs");
const { User, sequelize } = require('../../models').models;

// import envConfig
const { salt_rounds } = require("../../configs").envConfig;

/**
 * @name editPassword
 * @function editPassword
 * @description - A function query to edit the user's password
 * @param {Object} data - New password of the user
 * @param {String} hash - The hash of the user
 * @returns {Object} - Returns the edited user object or null or error if the user is not found
*/
const editPassword = async (data, hash) => {
  // Start a transaction
  const transaction = await sequelize.transaction();
  try {
    // Find the user by hash
    const user = await User.findOne({ where: { hash } }, { transaction });
    if (!user) {
      return {
        user: null,
        error: null,
      };
    }

    // verify the old password
    const isMatch = await bcrypt.compare(data.old_password, user.password);

    // if the password does not match
    if (!isMatch) {
      return {
        user: null,
        error: new Error("Incorrect current password"),
      };
    }

    // hash the password using bcrypt
    const hashPassword = await bcrypt.hash(data.password, salt_rounds);

    // edit the user password
    user.password = hashPassword;

    // Save the user
    await user.save({ transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      user: {
        hash: user.hash,
        email: user.email,
        picture: user.picture
      },
      error: null,
    };
  }
  catch (error) {
    await transaction.rollback();
    return {
      user: null,
      error: new Error("An error occurred while updating the password"),
    };
  }
}


/**
 * @name editEmail
 * @function editEmail
 * @description - A function query to edit the user's email
 * @param {String} email - New email of the user
 * @param {String} hash - The hash of the user
 * @returns {Object} - Returns the edited user object or null or error if the user is not found
*/
const editEmail = async (email, hash) => {
  // Start a transaction
  const transaction = await sequelize.transaction();
  try {
    // Find the user by hash
    const user = await User.findOne({ where: { hash } }, { transaction });
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

    // Commit the transaction
    await transaction.commit();

    return {
      user: {
        hash: user.hash,
        email: user.email,
      },
      error: null,
    };
  }
  catch (error) {
    
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
 * @param {String} hash - The 
 * @returns {Object} - Returns the edited user object or null or error if the user is not found
*/
const editContact = async (contact, hash) => {
  // Start a transaction
  const transaction = await sequelize.transaction();
  try {
    // Find the user by hash
    const user = await User.findOne({ where: { hash } }, { transaction });
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

    // Commit the transaction
    await transaction.commit();

    return {
      user: {
        hash: user.hash,
        email: user.email,
        contact: user.contact
      },
      error: null,
    };
  }
  catch (error) {
    
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
 * @param {String} hash - The hash of the user
 * @returns {Object} - Returns the edited user object or null or error if the user is not found
*/
const editBio = async (bio, hash) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the user by hash
    const user = await User.findOne({ where: { hash } }, { transaction });
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

    // Commit the transaction
    await transaction.commit();

    return {
      user: {
        hash: user.hash,
        email: user.email,
        bio: user.bio
      },
      error: null,
    };
  }
  catch (error) {
    
    await transaction.rollback();
    return {
      user: null,
      error,
    };
  }
}


/**
 * @name editPicture
 * @function editPicture
 * @description - A function query to edit the user's picture
 * @param {String} picture - New picture of the user
 * @param {String} hash - Hash of the user
 * @returns {Object} - Returns the edited user object or null or error if the user is not found
*/

const editPicture = async (picture, hash) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the user by hash
    const user = await User.findOne({ where: { hash } }, { transaction });
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

    // Commit the transaction
    await transaction.commit();

    return {
      user: {
        hash: user.hash,
        email: user.email,
        picture: user.picture
      },
      error: null,
    };
  }
  catch (error) {
    await transaction.rollback();
    return {
      user: null,
      error,
    };
  }
}

/**
 * @function editName
 * @name editName
 * @description - A function query to edit the user's name
 * @param {String} name - New name of the user
 * @param {String} hash - The hash of the user
 * @returns {Object} - Returns the edited user object or null or error if the user is not found
*/
const editName = async (name, hash) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the user by hash
    const user = await User.findOne({ where: { hash } }, { transaction });
    if (!user) {
      return {
        user: null,
        error: null,
      };
    }

    // edit the user email
    user.name = name;

    // Save the user
    await user.save({ transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      user: {
        hash: user.hash,
        email: user.email,
        name: user.name
      },
      error: null,
    };
  }
  catch (error) {
    
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
  editBio, editName,
  editPicture
}