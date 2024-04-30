const { redisConfig } = require('../configs').storageConfig;
const { Worker } = require('bullmq');
const { resetEmailHook } = require('../hooks').mailHook;


// Initialize the Bull worker for the mailQueue
const mailWorker = new Worker('mailQueue', async (job) => {
  console.log('Processing email job:', job.data);
  await resetEmailHook(job.data); // Run the resetEmailHook function for each job (upvote)
}, { connection: redisConfig });

mailWorker.on('completed', (job) => {
  console.log(`Mail job ${job.id} completed`);
});

mailWorker.on('failed', (job, err) => {
  console.error(`Mail job ${job.id} failed with error:`, err);
});

console.log('Mail worker process initialized');

module.exports = mailWorker;