// Import modules
const { transporter, passResetTemplate } = require('../configs').mailConfig;
// const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;


/**
 * @name resetEmailHook
 * @function resetEmailHook
 * @description A hook function that sends a password reset token to a user's email address
 * @param {String} from - The sender's email address
 * @param {String} user - The recipient's email address
 * @param {String} token - The password reset token
 * @returns {Promise<void>} - Returns a promise of void
*/
const resetEmailHook = async (data) => {
  if (!data || !data.user || !data.token || !data.from) {
    // Log the error
    console.error('Data(s) is undefined. Cannot initialize reset email hook process');

    return;
  }

  // Log the process initialization
  console.log('Reset email hook process initialized');

  // Set up email data
  const mailOptions = {
    from: data.from,
    to: data.user,
    subject: 'Qval | Password Reset',
    html: passResetTemplate(data.token),
  };

  // Use htmlToText plugin to provide a text alternative for HTML emails
  transporter.use('compile', htmlToText());

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
  }
  catch (error) {
    console.error('Error sending reset email:', error);
    // TODO: Create a handler for handling this error
  }
}


module.exports = {
  resetEmailHook
}