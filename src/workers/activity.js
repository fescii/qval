const { redisConfig } = require('../configs').storageConfig;
const { Worker } = require('bullmq');
const { activityHook } = require('../hooks');


// Initialize the Bull worker for the activityQueue
const activityWorker = new Worker('activityQueue', async (job) => {
  console.log('========Processing action job =====================');
  console.log(job.data);
  console.log('==================================================');
  await activityHook(job.data); // Run the activity hook
}, {connection: redisConfig});

activityWorker.on('completed', (job) => {
  console.log(`activity job ${job.id} completed`);
});

activityWorker.on('failed', (job, err) => {
  console.error(`activity job ${job.id} failed with error:`, err);

  // !TODO: Create a handler for handling this error
});

console.log('activity worker process initialized');


