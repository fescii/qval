// import sanitizeUtil from '../../utils/sanitize.util';
const { sanitizeUtil } = require('../../utils');


/**
 * @name validateSection
 * @function validateSection
 * @description a function that validates section data before being passed to the controllers or middlewares
 * @param {Object} data - The  payload section data object
 * @returns {Object} - The validated section data object: and error if any
*/
const validateSection = async data => {
  if (data.order && data.content) {
    // validate order
    if (typeof data.order !== 'number' || data.order < 1) {
      return {
        data: null,
        error: new Error("Section order should be a number and greater than 0!")
      }
    }
    // get title
    let title = data.title;

    // Check if title is provided, if provided validate it
    if (title) {
      // validate title
      if (typeof title !== 'string' || title.length < 2) {
        return {
          data: null,
          error: new Error("Section title should have 2 chars or more and must be a string!")
        }
      }

      title = await sanitizeUtil.sanitizeInput(title);
    }

    // validate content
    if (typeof data.content !== 'string' || data.content.length < 30) {
      return {
        data: null,
        error: new Error("Section content should have 30 chars or more and must be a string!")
      }
    }

    const validatedData = {
      order: data.order,
      title: title,
      content: await sanitizeUtil.sanitizeInput(data.content),
    }

    return { data: validatedData, error: null };
  }
  else {
    return {
      data: null,
      error: new Error("Some fields were not provided or contains null values, Ensure you provide: (order, content)")
    }
  }
}

/**
 * @name validateDraft
 * @function validateDraft
 * @description a function that validates draft data before being passed to the controllers or middlewares
 * @param {Object} data - The  payload draft data object
 * @returns {Object} - The validated draft data object: and error if any
*/
const validateDraft = async data => {
  if (data.order && data.kind && data.content) {
    // validate order
    if (typeof data.order !== 'number' || data.order < 1) {
      return {
        data: null,
        error: new Error("Draft order should be a number and greater than 0!")
      }
    }
    // get title
    let title = data.title;

    // Check if title is provided, if provided validate it
    if (title) {
      // validate title
      if (typeof title !== 'string' || title.length < 2) {
        return {
          data: null,
          error: new Error("Draft title should have 2 chars or more and must be a string!")
        }
      }

      title = await sanitizeUtil.sanitizeInput(title);
    }

    // get section
    let section = data.section;
    if (section) {
      // validate section
      if (typeof section !== 'number' || section < 1) {
        return {
          data: null,
          error: new Error("Draft section should be a number and greater than 0!")
        }
      }
    }

    // validate kind: muts be either 'new' or 'update'
    if (data.kind !== 'new' && data.kind !== 'update') {
      return {
        data: null,
        error: new Error("Draft type(kind) should be either 'new' or 'update'!")
      }
    }

    // validate content
    if (typeof data.content !== 'string' || data.content.length < 30) {
      return {
        data: null,
        error: new Error("Draft content should have 30 chars or more and must be a string!")
      }
    }

    const validatedData = {
      order: data.order,
      title: title,
      section: section,
      kind: data.kind,
      content: await sanitizeUtil.sanitizeInput(data.content)
    }

    return { data: validatedData, error: null };
  }
  else {
    return {
      data: null,
      error: new Error("Some fields were not provided or contains null values, Ensure you provide: (order, kind, content)")
    }
  }
}

module.exports = {
  validateSection, validateDraft
}