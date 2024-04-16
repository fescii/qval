// bullSetup.js
const { Queue } = require('bullmq');

// Replace these values with your actual Redis configuration
const redisOptions = {
  host: '127.0.0.1', // Redis server host
  port: 6379, // Redis server port
  password: '', // Redis server password (if required)
};

// Initialize queues
const upvoteQueue = new Queue('upvoteQueue', { connection: redisOptions });
const emailQueue = new Queue('emailQueue', { connection: redisOptions });

module.exports = {
  upvoteQueue,
  emailQueue,
};
