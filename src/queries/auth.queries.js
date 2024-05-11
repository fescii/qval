const bcrypt = require("bcryptjs");
// const { hashNumberWithKey } = require('../hash').identityHash;
const {hashConfig} = require("../configs");
const { User, Code, sequelize } = require("../models").models;
const { gen_hash } = require("../wasm");
const { hash_secret } = require("../configs").envConfig;
const { mailQueue } = require('../bull');
const { emailConfig }  = require('../configs').mailConfig;

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

  // console.log(data);

  try {
    // Check if a code exists
    let codeData = await Code.findOne({
      where: {
        email: data.email
      }
    });

    // Create an expiry date to be 10 minutes from now\
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10);


    // If the code exists update the code
    if (codeData) {
      codeData.code = data.code;
      codeData.expires = expires;
      await codeData.save({transaction});
    }
    // Else create a new code
    else {
      codeData = await Code.create({
        code: data.code,
        email: data.email,
        expires: expires
      }, {transaction});
    }

    // create data object to be sent to the mail queue
    const mailData = {
      from: emailConfig.user,
      user: codeData.email,
      token: codeData.code
    }

    // Add the code to the mail queue
    await mailQueue.add('upvoteJob', mailData);

    await transaction.commit();

    return { codeData: codeData, error: null}
  }
  catch (err) {
    await transaction.rollback();
    return { codeData: null, error: err}
  }
}

/**
 * @name verifyCode
 * @description - Verify the code user to the one in the db
 * @param {String} email - The email of the user
 * @param {String} token - The token of the user
 * @returns {Boolean} - Returns true or false
*/
const verifyCode = async (email, token) => {
  try {
    const code = await Code.findOne({
      where: {
        email: email
      }
    });

    // If the use has code and the code is equal to the token
    if (code) {
      // Check if the code is equal to the token
      if (code.code === token) {
        // Check if the expires date field is less than or equal to the current date
        if (code.expires <= new Date(Date.now())) {
          return false;
        }
        else {
          return true;
        }
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  catch (error) {
    return false;
  }
};

/**
 * @name editPassword
 * @function editPassword
 * @description - A query to edit the password of a user using email as key to search the user
 * @param {String} email - The email of the user
 * @param {String} password - The password of the user
 * @returns {Object} - Returns the user data or an error
*/
const editPassword = async (email, password) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the user
    const user = await User.findOne({
      where: {
        email: email
      }
    });

    // If the user exists
    if (user) {
      // Update the password
      user.password = bcrypt.hashSync(password, 8);
      await user.save({transaction});

      await transaction.commit();

      return { user: user, error: null}
    }
    else {
      return { user: null, error: null}
    }
  }
  catch (error) {
    await transaction.rollback();
    return { user: null, error: error}
  }
}

// Export the functions as a single object
module.exports = {
  addUser, checkIfUserExits, addOrEditCode,
  verifyCode, editPassword
}