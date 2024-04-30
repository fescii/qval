const bcrypt = require("bcryptjs");
// const { hashNumberWithKey } = require('../hash').identityHash;
const {hashConfig} = require("../configs");
const { User, Code, sequelize } = require("../models").models;
const { gen_hash } = require("../wasm");
const { hash_secret } = require("../configs").envConfig;

/**
 * @function addUser
 * @name addUser
 * @description - Add a new user to the database
 * @param {Object} data - The user data
 * @param {String} data.username - The username of the user
 * @param {String} data.first_name - The first name of the user
 * @param {String} data.last_name - The last name of the user
 * @param {String} data.email - The email of the user
 * @param {String} data.password - The password of the user
 * @returns {Object} - Returns the user data or an error
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

    // user.username = await hashNumberWithKey(hashConfig.user, user.id);

    // Generate the username - hash
    const {
      hash,
      error
    } = await gen_hash(hash_secret, hashConfig.user, user.id.toString());

    // If error is not equal to undefined throw an error
    if (error) {
      // console.log(error);
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
 * @name checkIfUserExits
 * @description - Check if a user exists in the database
 * @param {String} userEmail - The email of the user
 * @returns {Object} - Returns the user data or an error
 */
const checkIfUserExits = async (userEmail) => {
  try{
    const user = await User.findOne({
      where: {
        email: userEmail
      }
    });

    // console.log(user)
    if (user) {
      // console.log('This code runs')
      return { user: user, error: null}
    }
    else {
      return {user: null, error: null}
    }
  }
  catch (error) {
    return {user: null, error: error}
  }
}

/**
 * @function addOrEditCode
 * @name addOrEditCode
 * @description - Add or edit a code to the database
 * @param {Object} data - The code data
 * @param {String} data.token - The token code
 * @param {String} data.email - The email of the user
 * @returns {Object} - Returns the code data or an error
*/
const addOrEditCode = async data => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if a code exists
    const code = await Code.findOne({
      where: {
        email: data.email
      }
    });

    // Create an expiry date to be 10 minutes from now\
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10);


    // If the code exists update the code
    if (code) {
      code.token = data.token;
      code.expires = expires;
      await code.save({transaction});
    }
    // Else create a new code
    else {
      await Code.create({
        token: data.token,
        email: data.email,
        expires: expires
      }, {transaction});
    }

    await transaction.commit();

    return { code: code, error: null}
  }
  catch (err) {
    await transaction.rollback();
    return { code: null, error: err}
  }
}

// Export the functions as a single object
module.exports = {
  addUser, checkIfUserExits, addOrEditCode
}