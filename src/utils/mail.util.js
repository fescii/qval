const crypto = require('crypto');

/**
 * @name generateRandomToken
 * @function generateRandomToken
 * @description - A utility function that generates a random code
 * @param {String} - The length of the code to generate
 * @returns {String} - Returns a random code
*/
const generateRandomToken = async length => {
  const token = crypto.randomBytes(length).toString('hex');
  return token.slice(0, length).toUpperCase();
}

module.exports = {
  generateRandomToken
}
