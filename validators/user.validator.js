const { sanitizeUtil } = require('../utils')

// Register data validation
const registrationValidation = async (data) => {
  if (data.username && data.name && data.email && data.password) {

    // validate username
    if (typeof data.username !== 'string') {
      throw new TypeError("Username must be type text(string)!")
    }
    else {
      if (data.username.length < 5) {
        throw new Error("Username must have 5 characters or more!")
      }
    }

    // validate name
    if (typeof data.name !== 'string') {
      throw new TypeError("Name must be text(string)!")
    }
    else {
      if (data.name.length < 5) {
        throw new Error("Name must have 5 characters or more!")
      }
    }

    // validate email
    if (typeof data.email !== 'string') {
      throw new TypeError("Name must be text(string)!")
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
      username: await sanitizeUtil.sanitizeInput(data.username),
      name: await sanitizeUtil.sanitizeInput(data.name),
      email: await sanitizeUtil.sanitizeInput(data.email),
      password: await sanitizeUtil.sanitizeInput(data.password)
    }
  }
  else {
    throw new Error("Some fields were not provided or contains null values, Ensure you provide: (username, name, email, password)");
  }
}

// Register data validation 
const loginValidation = async (data) => {
  if (data.user_key && data.password) {

    // validate username
    if (typeof data.user_key !== 'string') {
      throw new TypeError("Email or username must be text(string)!")
    }

    // validate password
    if (typeof data.password !== 'string') {
      throw new TypeError("Password must be text(string)!")
    }

    return {
      user_key: await sanitizeUtil.sanitizeInput(data.user_key),
      password: await sanitizeUtil.sanitizeInput(data.password)
    }
  }
  else {
    throw new Error("Some fields were not provided or contains null values, Ensure you provide: (username/email, password)!");
  }
}


module.exports = {
  registrationValidation,
  loginValidation
}