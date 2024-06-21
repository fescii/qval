const { sanitizeUtil } = require('../../utils')

/**
 * @name validateTopic
 * @function validateTopic
 * @description a function that validates topic data before being passed to the controllers or middlewares
 * @param {Object} data - The topic data object
 * @returns {Object} - The validated topic data object
*/
const validateTopic = async data => {
  if (data.name && data.slug && data.summary)  {
    // validate first name
    if (typeof data.name !== 'string' || data.name.length < 2) {
      return {
        data: null,
        error: new Error("Topic name should have 2 chars or more and must be a string!")
      }
    }

    // validate last name
    if (typeof data.summary !== 'string' || data.summary < 30) {
      return {
        data: null,
        error: new Error("About topic should have 30 chars or more and must be a string!")
      }
    }

    const slug_data =  await sanitizeUtil.sanitizeInput(data.slug);

    const validatedData = {
      name: await sanitizeUtil.sanitizeInput(data.name),
      slug: slug_data.trim().replace(/\s+/g, ' ').toLowerCase().replace(/\s+/g, '-'),
      summary: await sanitizeUtil.sanitizeInput(data.summary),
    }

    return { data: validatedData, error: null };
  }
  else {
    return {
      data: null,
      error: new Error("Some fields were not provided or contains null values, Ensure you provide: (name, summary, slug)")
    }
  }
}

module.exports = {
  validateTopic
}