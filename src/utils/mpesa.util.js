const { mpesaConfig } = require('../configs')
const { timestamp } = require('./time.util')

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