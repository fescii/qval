/**
 * @function mapFields
 * @description Map an array of objects to an array of fields
 * @param {Array} arr - The array of objects
 * @param {String} field - The field to map
 * @returns {Array} - The array of fields
*/
const mapFields = async (arr, field) => {
  return arr.map(item => item[field])
}


/**
 * @function sumArray
 * @description Sum an array of numbers
 * @param {Array} arr - The array of numbers
 * @returns {Number} - The sum of the array
*/
const sumArray = async (arr) => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);


/**
 * @function slugify
 * @description A function to slugify a text
 * @param {String} text - The text to slugify
 * @returns {String} - The slugified text
*/
const slugify = (text) => {
  // return text.trim().replace(/\s+/g, ' ').
  //   toLowerCase().replace(/\s+/g, '-');

  // remove all commas, periods, and other punctuation
  // replace all spaces with hyphens
  // remove all non-alphanumeric characters
  return text.trim().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase();
}

/**
 * @function slugifyArray
 * @description A function to slugify an array of texts
 * @param {Array} arr - The array of texts to slugify
 * @returns {Array} - The array of slugified texts
*/
const slugifyArray = (arr) => {
  return arr.map(item => slugify(item));
};

module.exports = {
  mapFields, sumArray, slugifyArray, slugify
};