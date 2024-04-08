const { sanitizeUtil } = require('../utils')

// Register data validation
const validateUserData = async (data) => {
  if (data.first_name && data.last_name && data.email && data.password) {
    // validate first name
    if (typeof data.first_name !== 'string') {
      throw new TypeError("Firstname must be text(string)!")
    }
    else {
      if (data.first_name.length < 5) {
        throw new Error("Firstname must have 5 characters or more!")
      }
    }

    // validate last name
    if (typeof data.last_name !== 'string') {
      throw new TypeError("Lastname must be text(string)!")
    }
    else {
      if (data.last_name.length < 5) {
        throw new Error("Lastname must have 5 characters or more!")
      }
    }

    // validate email
    if (typeof data.email !== 'string') {
      throw new TypeError("Email must be text(string)!")
    }

    // validate password
    if (typeof data.password !== 'string') {
      throw new TypeError("Password must be text(string)!")
    }
    else {
      if (data.password.length < 6) {
        throw new Error("Password must have 6 characters or more!")
      }
    }

    return {
      firstName: await sanitizeUtil.sanitizeInput(data.firstName),
      lastName: await sanitizeUtil.sanitizeInput(data.lastName),
      email: await sanitizeUtil.sanitizeInput(data.email),
      password: await sanitizeUtil.sanitizeInput(data.password)
    }
  }
  else {
    throw new Error("Some fields were not provided or contains null values, Ensure you provide: (Firstname, Lastname, email, password)");
  }
}

// Register data validation
const validateLoginData = async (data) => {
  if (data.email && data.password) {

    // validate username
    if (typeof data.email !== 'string') {
      throw new TypeError("Email must be text(string)!")
    }

    // validate password
    if (typeof data.password !== 'string') {
      throw new TypeError("Password must be text(string)!")
    }

    return {
      email: await sanitizeUtil.sanitizeInput(data.email),
      password: await sanitizeUtil.sanitizeInput(data.password)
    }
  }
  else {
    throw new Error("Some fields were not provided or contains null values, Ensure you provide: (Email, Password)!");
  }
}


module.exports = {
  validateUserData,
  validateLoginData
}