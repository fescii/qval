const { redisConfig } = require('../configs').storageConfig;
const { Worker } = require('bullmq');
const { actionHook } = require('../hooks').actionHook;


// Initialize the Bull worker for the upvoteQueue
const actionWorker = new Worker('actionQueue', async (job) => {
  console.log('========Processing upvote job=====================');
  console.log(job.data);
  console.log('====================================');
  await actionHook(job.data); // Run the action hook
}, {connection: redisConfig});

actionWorker.on('completed', (job) => {
  console.log(`Action job ${job.id} completed`);
});

actionWorker.on('failed', (job, err) => {
  console.error(`Action job ${job.id} failed with error:`, err);

  // !TODO: Create a handler for handling this error
});

console.log('action worker process initialized');


