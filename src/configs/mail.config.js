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
  // get current year
  const year = new Date(Date.now()).getFullYear();

  return /* html */`
    <html>
    <head>
      <title>Password Reset</title>
    </head>
    <body>
      <p style="font-size: 20px; padding: 0 5px; margin: 0;">Use the following token to reset your password.</p>
      <p style="color: #08b86f; font-size: 36px; font-weight: 1000px; text-align: center; padding: 0 5px;" ><strong>${token}</strong></p>
      <p style="font-size: 20px; padding: 0 5px;">If you did not request a password reset, please ignore this email.</p>
      <div style="padding: 0 5px;">
        <span style="font-size: 18px; display: block;">Regards,</span>
        <span style="font-size: 18px; display: block;"> aduki Team</span>
      </div>
      <div style="display: flex; gap: 15px; border-top: 1px solid black; padding: 15px 5px; margin: 20px 0px 0px;">
        <span style="font-size: 14px; display: block;">©<span style="font-size: 14px;">${year}</span> aduki, Inc</span>
        <a href="https://femar.me" style="font-size: 14px; text-decoration: none; padding: 0 15px 0 15px">About</a>
        <a href="https://femar.me" style="font-size: 14px; text-decoration: none;">Privacy</a>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  emailConfig, transporter, passResetTemplate
}