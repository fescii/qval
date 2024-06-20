// Import and export all hooks in the index.js file
const mailHook = require("./mail.hook");
const actionHook = require("./action.hook");

// Export all hooks
module.exports = {
  mailHook,
  actionHook
};