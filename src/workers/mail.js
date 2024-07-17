const { redisConfig } = require('../configs').storageConfig;
const { Worker } = require('bullmq');
const { mailHook } = require('../hooks');


// Initialize the Bull worker for the mailQueue
const mailWorker = new Worker('mailQueue', async (job) => {
  console.log('Processing email job:');
  await mailHook(job.data); // Run the mailHook function for each job (upvote)
}, { connection: redisConfig });

mailWorker.on('completed', (job) => {
  console.log(`Mail job ${job.id} completed`);
});

mailWorker.on('failed', (job, err) => {
  console.error(`Mail job ${job.id} failed with error:`, err);
});

console.log('Mail worker process initialized');
