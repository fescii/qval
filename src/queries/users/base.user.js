// import models
const { Sequelize, sequelize, User} = require('../../models').models;

// import bcrypt
const bcrypt = require('bcrypt');

// import hashConfig
const {hashConfig} = require("../../configs");
const { salt_rounds } = require("../../configs").envConfig;

// import gen_hash
const { gen_hash } = require("../../wasm");

/**
 * @function addUser
 * @description Query to add a new user
 * @param {Object} data - The user data
 * @param {String} data.name - The name of the user
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
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, salt_rounds)
    }, {transaction});

    // Generate the user - hash
    const {
      hash,
      error
    } = await gen_hash(hashConfig.user, hashConfig.user, user.id.toString());


    // If error is not equal to undefined throw an error
    if (error) {
      throw error;
    }

    // Else set the user.hash to the hash
    user.hash = hash;

    await user.save({transaction});

    await transaction.commit();

    // On success return data
    return { 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        hash: user.hash
      }, 
      error: null
    }
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

/**
 * @function getUserByHash
 * @description Query to get a user by hash
 * @param {String} hash - The hash of the user
 * @param {String} currentUser - The hash of the current user
 * @returns {Object} - The user object or null, and the error if any
*/
const getUserByHash = async (hash, currentUser) => {
  // check if the current user is logged in
  if (currentUser) {
    return getUserWhenLoggedIn(hash, currentUser);
  }
  else {
    return getUser(hash);
  }
}

/**
 * @function getUser
 * @description Query to get a user by hash
 * @param {String} hash - The hash of the user
 * @returns {Object} - The user object or null, and the error if any
*/
const getUser = async (hash, you=false,) => {
  try {
    // Find the user by hash
    const user = await User.findOne({ 
      attributes: ['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified'],
      where: { hash } 
    });

    // If user is not found return null
    if (!user) {
      return { user: null, error: null };
    }

    // Return the user
    const data  = user.dataValues;

    // add is following to the user
    data.is_following = false;

    // if you are the user
    data.you = you;

    return { user: data, error: null };
  }
  catch (error) {
    return { user: null, error };
  }
}

/**
 * @function getUserWhenLoggedIn
 * @description Query to get a user by hash
 * @param {String} hash - The hash of the user to get
 * @param {String} currentUser - The hash of the current user
*/
const getUserWhenLoggedIn = async (hash, currentUser) => {
  try {
    // check if hash and current user are the same
    if (hash === currentUser) {
      return getUser(hash, true, true);
    }
    // Find the user by hash
    const user = await User.findOne({ 
      attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified',
        [
          Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = users.hash AND connects.from = '${currentUser}')`)),
          'is_following'
        ],
      ],
      where: { hash }
    });


    // If user is not found return null
    if (!user) {
      return { user: null, error: null };
    }

    // Return the user
    const data  = user.dataValues;

    // if you are the user
    data.you = false;

    // add authenticated to the user
    data.authenticated = true;

    return { user: data, error: null };
  }
  catch (error) {
    return { user: null, error };
  }
}


// Export the queries
module.exports = {
  addUser, getUserByHash,
  checkIfUserExits
};