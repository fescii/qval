// Function to sanitize inputs
const sanitizeInput = async (input) => {
  return input.replace(/['"\\]/g, '');
}

module.exports = {
  sanitizeInput,
}