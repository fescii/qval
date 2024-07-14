// Import and export all hooks in the index.js file
const mailHook = require("./mail");
const actionHook = require("./action");
const activityHook = require("./activity");

// Export all hooks
module.exports = {
  mailHook,
  actionHook,
  activityHook
};