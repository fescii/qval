const { redisConfig } = require('../configs').storageConfig;
const { Queue } = require('bullmq');


// Initialize queues
const upvoteQueue = new Queue('upvoteQueue', { connection: redisConfig });
const emailQueue = new Queue('emailQueue', { connection: redisConfig });

module.exports = {
  upvoteQueue,
  emailQueue,
};
