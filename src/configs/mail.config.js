// Importing the nodemailer module
const nodemailer = require('nodemailer');

/**
 * @name emailConfig
 * @description - An object that contains the email service configuration
 * @type {Object}
*/
const emailConfig = {
  service: process.env['EMAIL_SERVICE'],
  host: process.env['EMAIL_HOST'],
  user: process.env['EMAIL_USER'],
  pass: process.env['EMAIL_PASSWORD'],
}

/**
 * @name transporter
 * @function transporter
 * @description A function that initializes the email transporter
 * @returns {Object} - Returns an email transporter object
*/
const transporter = nodemailer.createTransport({
  service: emailConfig.service,
  // host: emailConfig.host,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});


// Set up HTML email template for password reset token
const passResetTemplate = token => {
  return /* html */`
    <html>
    <head>
      <title>Password Reset</title>
    </head>
    <body>
      <h1>Qval | Password Reset Request</h1>
      <p>Use the following token to reset your password:</p>
      <p style="color: #08b86f;" ><strong>${token}</strong></p>
    </body>
    </html>
  `;
}

module.exports = {
  emailConfig, transporter, passResetTemplate
}