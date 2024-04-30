// Import and export all hooks in the index.js file
const upvoteHook = require("./upvote.hook");
const mailHook = require("./mail.hook");

// Export all hooks
module.exports = {
  upvoteHook, mailHook
};