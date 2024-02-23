const { sanitizeUtil } = require('../utils')

// New  post data validation
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


module.exports = {
  newPostValidator
}