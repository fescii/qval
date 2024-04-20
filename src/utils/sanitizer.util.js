
/**
 * @name sanitizeInput
 * @function sanitizeInput
 * @description Sanitize inputs to prevent SQL injection
 * @param {string} input - The input to be sanitized
 * @returns {string} - The sanitized input
*/
const sanitizeInput = async (input) => {
  return input.replace(/['"\\]/g, '');
}

module.exports = {
  sanitizeInput,
}