const { sanitizeUtil } = require('../utils')

// Register data validation
const validateTopicData = async (data) => {
  if (data.name && data.slug && data.about)  {
    // validate first name
    if (typeof data.name !== 'string' || data.name.length < 2) {
      return {
        data: null,
        error: new Error("Topic name should have 2 chars or more and must be a string!")
      }
    }
    
    // validate last name
    if (typeof data.about !== 'string' || data.about < 2) {
      return {
        data: null,
        error: new Error("About topic should have 2 chars or more and must be a string!")
      }
    }
    
    const slug_data =  await sanitizeUtil.sanitizeInput(data.slug);
    
    const validatedData = {
      name: await sanitizeUtil.sanitizeInput(data.name),
      slug: slug_data.trim().replace(/\s+/g, ' ').
      toLowerCase().replace(/\s+/g, '-'),
      about: await sanitizeUtil.sanitizeInput(data.about),
    }
    
    return { data: validatedData, error: null };
  }
  else {
    return {
      data: null,
      error: new Error("Some fields were not provided or contains null values, Ensure you provide: (name, about, slug)")
    }
  }
}

module.exports = {
  validateTopicData
}