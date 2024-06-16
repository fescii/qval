const { sanitizeUtil } = require('../../utils');

/**
 * @function validatePassword
 * @name validatePassword
 * @description A validator function to validate password before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated password object
 * @returns {Error} - The error object
*/
const validatePassword = async (data) => {
  //check if password is provided
  if (!data.password) {
    return {
      data: null,
      error: new Error("Password field is required!")
    }
  }
  if (typeof data.password !== 'string' || data.password.length < 6) {
    return {
      data: null,
      error: new Error("Password should have 6 chars or more and must be a string!")
    }
  }
  return {
    data: {
      password: data.password
    },
    error: null
  }
}

/**
 * @function validateUsername
 * @name validateUsername
 * @description A validator function to validate username before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated username object
 * @returns {Error} - The error object
*/
const validateEmail = async (data) => {
  //check if email is provided
  if (!data.email) {
    return {
      data: null,
      error: new Error("Email field is required!")
    }
  }

  //sanitize email
  const email = await sanitizeUtil.sanitizeInput(data.email)

  // validate email
  // noinspection RegExpRedundantEscape
  let validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!email.match(validRegex)){
    return {
      data: null,
      error: new Error("Invalid email address!")
    }
  }

  return {
    data: {
      email: email
    },
    error: null
  }
}

/**
 * @function validateContact
 * @name validateContact
 * @description A validator function to validate Contact before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated Contact object
 * @returns {Error} - The error object
*/
const validateContact = async (data) => {
  //check if contact is provided
  if (!data.contact) {
    return {
      data: null,
      error: new Error("Contact field is required!")
    }
  }

  // Check if contact is type of object/json
  if (typeof data.contact !== 'object') {
    return {
      data: null,
      error: new TypeError("Contact must be an object!")
    }
  }

  return {
    data: {
      contact: data.contact
    },
    error: null
  }
}

/**
 * @function validateBio
 * @name validateBio
 * @description A validator function to validate bio before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated bio object
 * @returns {Error} - The error object
*/
const validateBio = async (data) => {
  //check if bio is provided
  if (!data.bio) {
    return {
      data: null,
      error: new Error("Bio field is required!")
    }
  }

  //sanitize bio
  const bio = await sanitizeUtil.sanitizeInput(data.bio)

  return {
    data: { bio: bio },
    error: null
  }
}

/**
 * @function validateName
 * @name validateName
 * @description A validator function to validate name before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated name object or an error object
*/
const validateName = async (data) => {
  //check if name is provided
  if (!data.first_name || !data.last_name) {
    return {
      data: null,
      error: new Error("First name and Last name fields are required!")
    }
  }

  //sanitize name
  const name = `${await sanitizeUtil.sanitizeInput(data.first_name)} ${await sanitizeUtil.sanitizeInput(data.last_name)}`

  return {
    data: { name: name },
    error: null
  }
}


// Export all validators
module.exports = {
  validatePassword,
  validateEmail,
  validateContact,
  validateBio,
  validateName
};