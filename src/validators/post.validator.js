const { sanitizeUtil } = require('../utils')

/**
 * @name newPostValidator
 * @function newPostValidator
 * @description a function that validates post data before being passed to the controllers or middlewares
 * @param {Object} data - The post data object
 * @returns {Object} - The validated post data object
 */
const newPostValidator = async (data) => {
  if (data.title && data.tags && data.introduction) {

    // validate title
    if (typeof data.title !== 'string') {
      throw new TypeError("Title must be type text(string)!")
    }
    else {
      if (data.title.length < 5) {
        throw new Error("Title must have 5 characters or more!")
      }
    }

    // validate description
    if (typeof data.introduction !== 'string') {
      throw new TypeError("Introduction must be text(string)!")
    }
    else {
      if (data.introduction.length < 5) {
        throw new Error("Introduction have 5 characters or more!")
      }
    }

    return {
      title: await sanitizeUtil.sanitizeInput(data.title),
      tags: data.tags,
      introduction: await sanitizeUtil.sanitizeInput(data.introduction)
    }
  }
  else {
    throw new Error("Some fields were not provided or contains null values, Ensure you provide: (Title, Topics/Tags, Introduction)");
  }
}

/**
 * @name sectionValidator
 * @function sectionValidator
 * @description a function that validates section data before being passed to the controllers or middlewares
 * @param {Object} data - The section data object
 * @returns {Object} - The validated section data object
*/
const sectionValidator = async (data) => {
  if (data.title && data.content) {

    // validate title
    if (typeof data.title !== 'string') {
      throw new TypeError("Title must be type text(string)!")
    }
    else {
      if (data.title.length < 5) {
        throw new Error("Title must have 5 characters or more!")
      }
    }

    // validate description
    if (typeof data.content !== 'string') {
      throw new TypeError("Content must be text(string)!")
    }
    else {
      if (data.content.length < 5) {
        throw new Error("Content must have 5 characters or more!")
      }
    }

    return {
      title: await sanitizeUtil.sanitizeInput(data.title),
      content: await sanitizeUtil.sanitizeInput(data.content)
    }
  }
  else {
    throw new Error("Some fields were not provided or contains null values, Ensure you provide: (Title, & Content)");
  }
}

/**
 * @name commentValidator
 * @function commentValidator
 * @description a function that validates comment data before being passed to the controllers or middlewares
 * @param {Object} data - The comment data object
 * @returns {Object} - The validated comment data object
*/
const commentValidator = async (data) => {
  if (data.name && data.email && data.content) {

    // validate first name
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
      throw new TypeError("Email must be text(string)!")
    }

    // validate password
    if (typeof data.content !== 'string') {
      throw new TypeError("Password must be text(string)!")
    }

    return {
      name: await sanitizeUtil.sanitizeInput(data.name),
      email: await sanitizeUtil.sanitizeInput(data.email),
      content: await sanitizeUtil.sanitizeInput(data.content)
    }
  }
  else {
    throw new Error("Some fields were not provided or contains null values, Ensure you provide: (Name, Email, and Comment/Content)");
  }
}


module.exports = {
  newPostValidator,
  sectionValidator,
  commentValidator
}