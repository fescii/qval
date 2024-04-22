const fs = require('fs');

/**
 * @name createDirectory
 * @function createDirectory
 * @description - A function to create a directory from the working dir if it doesn't exists
 * @param {String} - Path name
 * @returns {String | undefined} - Returns a string of the path or undefined value
*/
const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};


module.exports = {
  createDirectory
}
