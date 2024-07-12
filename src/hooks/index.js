// Import and export all hooks in the index.js file
const mailHook = require("./mail");
const actionHook = require("./action");

// Export all hooks
module.exports = {
  mailHook,
  actionHook
};