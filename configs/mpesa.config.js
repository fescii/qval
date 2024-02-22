const mpesaConfig = {
  consumer_key: process.env['MPESA_CONSUMER_KEY'],
  consumer_secret: process.env['MPESA_CONSUMER_SECRET'],
  url: process.env['MPESA_URL'],
  auth_url: process.env['MPESA_AUTH_TOKEN_URL'],
  passkey: process.env['MPESA_PASSKEY'],
  shortcode: process.env['MPESA_SHORTCODE'],
  auth: process.env['MPESA_AUTH'],
  confirm_url: process.env['MPESA_CONFIRM_URL']
};

module.exports = mpesaConfig;