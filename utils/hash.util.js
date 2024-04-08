const { authConfig } = require('../configs')
const crypto = require('crypto');

const hashNumberWithKey = async (section, number) => {
  const hmac = await crypto.createHmac('sha256', authConfig.hash_secret);
  hmac.update(number.toString());
  let digested_hash =  hmac.digest('hex');
  
  switch (section) {
    case 'U':
      return `U0${digested_hash.slice(0, 10).toLocaleUpperCase()}`
    case 'P':
      return `P0${digested_hash.slice(0, 10).toLocaleUpperCase()}`
    case 'T':
      return `T0${digested_hash.slice(0, 10).toLocaleUpperCase()}`
    case 'N':
      return `N0${digested_hash.slice(0, 10).toLocaleUpperCase()}`
    default:
      return `R0${digested_hash.slice(0, 10).toLocaleUpperCase()}`
  }
}

module.exports = {
  hashNumberWithKey
}