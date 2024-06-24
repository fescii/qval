// Import sanitizeUtil from src/utils/sanitize.util.js
const sanitizeInput = require('../../utils').sanitizeUtil;

/**
 * @name validateSection
 * @function validateSection
 * @description a validator function that validates story section data before being passed to the controllers or middlewares
 * @param {Object} data - The story section data object
 * @returns {Object} data - The validated story section data object and error if any
*/
const validateSection = async data => {
  try {
    // Check if the data mandatory fields are present
    if (!data.kind || !data.content || !data.order || typeof data.kind !== 'string' || typeof data.content !== 'string' || typeof data.order !== 'number') {
      return {
        data: null,
        error: new Error('Kind and content are required and should be strings, order should be a number')
      };
    }

    // Check if title is present and is a string
    if (data.title && typeof data.title !== 'string') {
      return {
        data: null,
        error: new Error('Title should be a string')
      };
    }

    if(title) {
      data.title = await sanitizeInput(data.title);
    }

    // Construct the validated data object
    const validatedData = {
      kind: data.kind,
      content: await sanitizeInput(data.content),
      order: data.order,
      title: data.title || null
    };

    return {
      data: validatedData,
      error: null
    };
  }
  catch (error) {
    return {
      data: null,
      error: new Error('An error occurred while validating the story section data')
    };
  }
}


/**
 * @name validateSectionContent
 * @function validateSectionContent
 * @description a validator function that validates story section data before being passed to the controllers or middlewares
 * @param {Object} data - The story section data object
 * @returns {Object} data - The validated story section data object and error if any
*/
const validateSectionContent = async data => {
  try {
    // Check if the data mandatory fields are present
    if (!data.content || !data.id || typeof data.content !== 'string' || typeof data.id !== 'number') {
      return {
        data: null,
        error: new Error('Content body and section identity are required and should be a string and number respectively')
      };
    }

    // Check if title is present and is a string
    if (data.title && typeof data.title !== 'string') {
      return {
        data: null,
        error: new Error('Title should be a string')
      };
    }

    if(title) {
      data.title = await sanitizeInput(data.title);
    }

    // Construct the validated data object
    const validatedData = {
      content: await sanitizeInput(data.content),
      title: data.title || null,
      id: data.id
    };

    return {
      data: validatedData,
      error: null
    };
  }
  catch (error) {
    return {
      data: null,
      error: new Error('An error occurred while validating the story section data')
    };
  }
}

module.exports = {
  validateSection, validateSectionContent
};