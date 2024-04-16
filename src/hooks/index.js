// Import and export all hooks in the index.js file
const upvoteHook = require("./upvote.hook");
const likeHook = require("./like.hook");


// Export all hooks
module.exports = {
  upvoteHook,
  likeHook
};