mapFields = (arr, field) => {
  return arr.map(item => item[field])
}
sumArray = (arr) => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

const arrayUtil = {
  mapFields: mapFields,
  sumArray: sumArray
};

module.exports = arrayUtil;