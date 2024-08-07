const { redisConfig } = require('../configs').storageConfig;
const { Worker } = require('bullmq');
const { actionHook } = require('../hooks');
const { socketQueue } = require('../bull');


// Initialize the Bull worker for the upvoteQueue
const actionWorker = new Worker('actionQueue', async (job) => {
  console.log('========Processing action job =====================');
  // console.log(job.data);
  console.log('==================================================');
  await actionHook(job.data); // Run the action hook

  // construct the message to be sent to the WebSocket server
  if (job.data.publish) {
    const message = {
      type: 'action',
      data: job.data
    };
  
    // Send the message to the WebSocket server using the socketQueue
    await socketQueue.add('socketQueue', message, { attempts: 3, backoff: 1000, removeOnComplete: true });
  }

}, {connection: redisConfig});

actionWorker.on('completed', (job) => {
  console.log(`Action job ${job.id} completed`);
});

actionWorker.on('failed', (job, err) => {
  console.error(`Action job ${job.id} failed with error:`, err);

  // !TODO: Create a handler for handling this error
});

console.log('action worker process initialized');


