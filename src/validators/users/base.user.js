const { sanitizeUtil } = require('../../utils');

/**
 * @function validateUser
 * @name validateUser
 * @description A validator function to validate user data before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated topic data object
*/
const validateUser = async data => {
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
 * @function validateLogin
 * @name validateLogin
 * @description A validator function to validate user data before being passed controllers or middlewares
 * @param {Object} data - The input data from client request
 * @returns {Object} - The validated topic data object
*/
const validateLogin = async data => {
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

    // validate email
    // noinspection RegExpRedundantEscape
    let validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!data.email.match(validRegex)) {
      return {
        data: null,
        error: new Error("Invalid email address!")
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
 * @module Export all validators
 * @name Validators
 * @description Export all validators as an object
*/
module.exports = {
  validateUser, validateLogin
}