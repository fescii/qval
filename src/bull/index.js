const { redisConfig } = require('../configs').storageConfig;
const { Queue } = require('bullmq');


// Initialize queues
const actionQueue = new Queue('actionQueue', { connection: redisConfig });
const mailQueue = new Queue('mailQueue', { connection: redisConfig });
const socketQueue = new Queue('socketQueue', { connection: redisConfig });
const activityQueue = new Queue('activityQueue', { connection: redisConfig });

const addActivity = async data => {
  // check if data is available and contains kind field
  if (!data?.kind || !data?.action || !data?.author || !data?.target || !data?.name || !data?.verb) {
    // Log the error
    console.error('Data is undefined. Adding activity hook process failed');
    return;
  }

  // construct the job payload: for queueing || add the job to the queue
  await activityQueue.add('activityJob', data, { attempts: 3, backoff: 1000, removeOnComplete: true });
}

module.exports = {
  actionQueue, activityQueue, 
  mailQueue, socketQueue, addActivity
};
