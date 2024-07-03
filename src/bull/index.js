const { redisConfig } = require('../configs').storageConfig;
const { Queue } = require('bullmq');


// Initialize queues
const actionQueue = new Queue('actionQueue', { connection: redisConfig });
const mailQueue = new Queue('mailQueue', { connection: redisConfig });
const socketQueue = new Queue('socketQueue', { connection: redisConfig });

module.exports = {
  actionQueue,
  mailQueue, socketQueue
};
