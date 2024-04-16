
const { worker } = require('bullmq');
const { upvoteHook } = require('../hooks').upvoteHook;

// Initialize the Bull worker for the upvoteQueue
const upvoteWorker = worker('upvoteQueue', async (job) => {
  console.log('Processing upvote job:', job.data);
  await upvoteHook(); // Run the upvoteHook function for each job (upvote)
});

upvoteWorker.on('completed', (job) => {
  console.log(`Upvote job ${job.id} completed`);
});

upvoteWorker.on('failed', (job, err) => {
  console.error(`Upvote job ${job.id} failed with error:`, err);
});

console.log('Upvote worker process initialized');

module.exports = upvoteWorker;

