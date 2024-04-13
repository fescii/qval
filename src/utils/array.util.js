// Mapping array of objects to array of fields
const mapFields = async (arr, field) => {
  return arr.map(item => item[field])
}

// Summing array of numbers
const sumArray = async (arr) => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);


// Mapping array of string to slug fields using regex

const slugify = async (text) => {
  return text.trim().replace(/\s+/g, ' ').
    toLowerCase().replace(/\s+/g, '-');
}

const slugifyArray = async (arr) => {
  return arr.map(item => slugify(item));
};

module.exports = {
  mapFields, sumArray, slugifyArray, slugify
};