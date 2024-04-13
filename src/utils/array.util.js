// Mapping array of objects to array of fields
const mapFields = (arr, field) => {
  return arr.map(item => item[field])
}

// Summing array of numbers
const sumArray = (arr) => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);


// Mapping array of string to slug fields using regex

const slugify = (text) => {
  return text.trim().replace(/\s+/g, ' ').
    toLowerCase().replace(/\s+/g, '-');
}

const slugifyArray = (arr) => {
  return arr.map(item => slugify(item));
};

const arrayUtil = {
  mapFields, sumArray, slugifyArray, slugify
};

module.exports = arrayUtil;