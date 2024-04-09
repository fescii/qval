const { sanitizeUtil } = require('../utils')

// Register data validation
const validateTopicData = async (data) => {
  if (data.name && data.slug && data.about) {
    // validate name
    if (typeof data.name !== 'string') {
      throw new TypeError("Topic name must be text(string)!")
    }
    else {
      if (data.name.length < 2) {
        throw new Error("Topic name must have 2 characters or more!")
      }
    }
    
    // validate slug
    if (typeof data.slug !== 'string') {
      throw new TypeError("Topic slug must be text(string)!")
    }
    else {
      if (data.slug.length < 2) {
        throw new Error("Topic slug must have 2 characters or more!")
      }
    }
    
    if (typeof data.about !== 'string') {
      throw new TypeError("Topic about must be text(string)!")
    }
    else {
      if (data.name.about < 5) {
        throw new Error("Topic about must have 5 characters or more!")
      }
    }
    
    const slug_data =  await sanitizeUtil.sanitizeInput(data.slug);
    
    return {
      name: await sanitizeUtil.sanitizeInput(data.name),
      slug: slug_data.trim().replace(/\s+/g, ' ').
      toLowerCase().replace(/\s+/g, '-'),
      about: await sanitizeUtil.sanitizeInput(data.about),
    }
  }
  else {
    throw new Error("Some fields were not provided or contains null values, Ensure you provide: (Name, Slug)");
  }
}

module.exports = {
  validateTopicData
}