
/**
 * @name currentTimestamp
 * @function currentTimestamp
 * @description This utility module provides functions for working with timestamps and dates.
 * @returns {string} - The current timestamp
*/
const currentTimestamp = () => {
  const date = new Date();

  let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  let day = String(date.getDate()).padStart(2, '0');
  let hour = String(date.getHours()).padStart(2, '0');
  let minute = String(date.getMinutes()).padStart(2, '0');
  let second = String(date.getSeconds()).padStart(2, '0');

  return `${date.getFullYear()}${month}${day}${hour}${minute}${second}`;
};

/**
 * @name localTime
 * @function localTime
 * @description a utility function that converts a date in numeric format to local time
 * @param {number} dateNumeric - The date in numeric format
 * @returns {string} - The local time
*/
const localTime = (dateNumeric) => {
  const dateString = dateNumeric.toString();
  // console.log(dateString)
  const year = parseInt(dateString.slice(0, 4));
  const month = parseInt(dateString.slice(4, 6)) - 1; // Months are zero-based (0-11)
  const day = parseInt(dateString.slice(6, 8));
  const hours = parseInt(dateString.slice(8, 10));
  const minutes = parseInt(dateString.slice(10, 12));
  const seconds = parseInt(dateString.slice(12, 14));

  const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

  const options = { timeZone: 'Africa/Nairobi' }; // Set the time zone to East African Time (EAT)
  // return new Intl.DateTimeFormat('en-US', options).format(date);
  return date.toLocaleString('en-US', options)
};


/**
 * @name formatDate
 * @function formatDate
 * @description a utility function that formats a date in numeric format to ISO format
 * @param {number} inputDate - The date in numeric format
 * @returns {string} - The date in ISO format
*/
const formatDate = inputDate => {
  const dateString = inputDate.toString(); // Your date string
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);
  const hour = dateString.slice(8, 10);
  const minute = dateString.slice(10, 12);
  const second = dateString.slice(12, 14);
  const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  return date.toISOString();
};


/**
 * @type {Object}
 * @property {string} timestamp - The current timestamp
 * @property {function} localTime - The local time function
 * @property {function} formatDate - The format date function
 * @description The time utility object
*/
const timeUtil = {
  timestamp: currentTimestamp(),
  localTime: localTime,
  formatDate: formatDate
};

module.exports = timeUtil;