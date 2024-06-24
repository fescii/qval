// Import sanitizeUtil from src/utils/sanitize.util.js
const sanitizeInput = require('../../utils').sanitizeUtil;


/**
 * @name validateReply
 * @function validateReply
 * @description a validator function that validates story reply data before being passed to the controllers or middlewares
 * @param {Object} data - The story reply data object
 * @returns {Object} data - The validated story reply data object and error if any
*/
const validateReply = async data => {
  try {
    // Check if the data mandatory fields are present
    if (!data.kind || !data.content || typeof data.kind !== 'string' || typeof data.content !== 'string') {
      return {
        data: null,
        error: new Error('Kind and content are required and should be strings')
      };
    }

    // Construct the validated data object
    const validatedData = {
      kind: data.kind,
      content: await sanitizeInput(data.content)
    };

    return {
      data: validatedData,
      error: null
    };
  }
  catch (error) {
    return {
      data: null,
      error: new Error('An error occurred while validating the story reply data')
    };
  }
}

/**
 * @name validateReplyContent
 * @function validateReplyContent
 * @description a validator function that validates story reply content before being passed to the controllers or middlewares
 * @param {Object} data - The story reply content object
 * @returns {Object} data - The validated story reply content object and error if any
*/
const validateReplyContent = async data => {
  try {
    // Check if the data mandatory fields are present
    if (!data.content || typeof data.content !== 'string') {
      return {
        data: null,
        error: new Error('Content is required and should be a string')
      };
    }

    // Construct the validated data object
    const validatedData = {
      content: await sanitizeInput(data.content)
    };

    return {
      data: validatedData,
      error: null
    };
  }
  catch (error) {
    return {
      data: null,
      error: new Error('An error occurred while validating the story reply content data')
    };
  }
}

module.exports = {
  validateReply, validateReplyContent
};