// bullSetup.js
const { Queue } = require('bullmq');

// Initialize queues
const upvoteQueue = new Queue('upvoteQueue');
const emailQueue = new Queue('emailQueue');

module.exports = {
  upvoteQueue,
  emailQueue,
};
