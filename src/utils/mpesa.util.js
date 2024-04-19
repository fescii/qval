const { mpesaConfig } = require('../configs')
const { timestamp } = require('./time.util')

/**
 * @type {Object}
 * @property {string} url - The mpesa endpoint
 * @property {string} auth_url - The mpesa auth endpoint
 * @property {string} bs_short_code - The business shortcode
 * @property {string} passkey - The mpesa passkey
 * @property {string} timestamp - The current timestamp
 * @property {string} password - The base64 encoded password
 * @property {string} transaction_type - The transaction type
 * @property {string} amount - The amount to be transacted
 * @property {string} partyB - The business shortcode
 * @property {string} callBackUrl - The callback url
 * @property {string} accountReference - The account reference
 * @property {string} transaction_desc - The transaction description
 * @description The mpesa data object
 */
mpesaData = {
  url: mpesaConfig.url,
  auth_url: mpesaConfig.auth_url,
  bs_short_code: mpesaConfig.shortcode,
  passkey: mpesaConfig.passkey,
  timestamp: timestamp,

  password: new Buffer.from(`${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`).toString('base64'),
  transaction_type: "CustomerPayBillOnline",
  amount: "1", //you can enter any amount
  partyA: "party-sending-funds", //should follow the format:2547xxxxxxxx
  partyB: mpesaConfig.shortcode,
  phoneNumber: "party-sending-funds", //should follow the format:2547xxxxxxxx
  callBackUrl: "https://nicely-thorough-monster.ngrok-free.app/api/v1/mpesa/callback",
  accountReference: "lipa-na-mpesa-tutorial",
  transaction_desc: "Testing lipa na mpesa functionality"
};

module.exports = mpesaData;