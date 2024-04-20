// Import sanitize utility function
const { sanitizeInput } = require('../utils').sanitizeUtil;


/**
 * @name validateOpinionData
 * @function validateOpinionData
 * @description a function that validates opinion data before being passed to the controllers or middlewares
 * @param {Object} data - The opinion data object
 * @returns {Object} - The validated opinion data object
*/
const validateOpinionData = async (data) => {

  // Check if all fields are provided
  if (!data.body) {
    return {
      data: null,
      error: new Error("Missing fields, make sure you provide all the fields required!")
    }
  }

  // Check if body is a string and is at least 2 chars long
  if (typeof data.body !== 'string' || data.body.length < 2) {
    return {
      data: null,
      error: new Error("Body should be a string, should be at least 2 chars long!")
    }
  }

  // Sanitize body
  const body = await sanitizeInput(data.body);

  // Create opinion data object
  const validatedData = {
    body: body
  }

  // Return validated data
  return { data: validatedData, error: null };
}


// Export opinion validator
module.exports = {
  validateOpinionData
}