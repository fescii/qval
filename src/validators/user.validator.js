const { sanitizeUtil } = require('../utils')

/**
 * @function validateUserData
 * @name validateUserData
 * @description A validator function to validate user data before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated topic data object
*/
const validateUserData = async (data) => {
  if (data.first_name && data.last_name && data.email && data.password) {
    // validate first name
    if (typeof data.first_name !== 'string' || data.first_name.length < 2) {
      return {
        data: null,
        error: new Error("First name should have 2 chars or more and must be a string!")
      }
    }

    // validate last name
    if (typeof data.last_name !== 'string' || data.last_name.length < 2) {
      return {
        data: null,
        error: new Error("Last name should have 2 chars or more and must be a string!")
      }
    }

    // validate email
    // noinspection RegExpRedundantEscape
    let validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!data.email.match(validRegex)){
      return {
        data: null,
        error: new Error("Invalid email address!")
      }
    }

    // validate password
    if (typeof data.password !== 'string' || data.password.length < 6) {
      return {
        data: null,
        error: new Error("Password should have 6 chars or more and must be a string!")
      }
    }

    const validatedData = {
      first_name: await sanitizeUtil.sanitizeInput(data.first_name),
      last_name: await sanitizeUtil.sanitizeInput(data.last_name),
      email: await sanitizeUtil.sanitizeInput(data.email),
      password: await sanitizeUtil.sanitizeInput(data.password)
    }

    return { data: validatedData, error: null };
  }
  else {
    return {
      data: null,
      error: new Error("Some fields were not provided or contains null values, Ensure you provide: (Firstname, Lastname, email, password)")
    }
  }
}

/**
 * @function validateLoginData
 * @name validateLoginData
 * @description A validator function to validate user data before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated topic data object
*/
const validateLoginData = async (data) => {
  if (data.email && data.password) {

    // validate username
    if (typeof data.email !== 'string') {
      return {
        data: null,
        error: new TypeError("Email must be text(string)!")
      }
    }

    // validate password
    if (typeof data.password !== 'string') {
      return {
        data: null,
        error: new TypeError("Password must be text(string)!")
      }
    }

    const validatedData =  {
      email: await sanitizeUtil.sanitizeInput(data.email),
      password: await sanitizeUtil.sanitizeInput(data.password)
    }

    return { data: validatedData, error:null }
  }
  else {
    return {
      data: null,
      error: new Error("Some fields were not provided or contains null values, Ensure you provide: (email, password)")
    }
  }
}

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
 * @function validateUsername
 * @name validateUsername
 * @description A validator function to validate username before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated username object
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
 * @module Export all validators
 * @name Validators
 * @description Export all validators as an object
*/
module.exports = {
  validateUserData,
  validateLoginData,
  validatePassword,
  validateEmail,
  validateContact,
  validateBio
}