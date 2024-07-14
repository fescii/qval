const { redisConfig } = require('../configs').storageConfig;
const { Worker } = require('bullmq');
const { socketQueue, actionQueue, activityQueue } = require('../bull');
const uWs = require('uWebSockets.js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// import path module
const path = require('path');

// const credentials = {
//   key_file_name: 'misc/key.pem',
//   cert_file_name: 'misc/cert.pem',
// }

const credentials = {
  key: fs.readFileSync(path.join(__dirname, '../ssl_certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../ssl_certs', 'cert.pem')),
}


// Create the WebSocket server
const app = uWs.SSLApp(credentials).ws('/events', {
  /* Options */
  compression: uWs.SHARED_COMPRESSOR,
  maxPayloadLength: 16 * 1024 * 1024,
  idleTimeout: 960,
  /* Handlers */
  open: (ws, req) => {
    console.log('A WebSocket connected');
  },
  message: (ws, message, isBinary) => {
    console.log('A WebSocket message received:', message);
  },
  drain: (ws) => {
    console.log('A WebSocket backpressure drained');
  },
  close: (ws, code, message) => {
    console.log('A WebSocket closed with code:', code, 'and message:', message);
  },
  error: (ws, error) => {
    console.error('A WebSocket error occurred:', error);
  }
}).listen(3001, (listenSocket) => {
  if (listenSocket) {
    console.log('Listening to port 3001');
  } else {
    console.error('Failed to listen to port 3001');
  }
});


// Initialize the Bull worker for the socketQueue
const socketWorker = new Worker('socketQueue', async (job) => {
  console.log('========Processing socket job =====================');
  console.log(job.data);
  console.log('==================================================');
  
  // Send the message to the WebSocket server
  // !Todo - Implement the WebSocket to send received messages to the client
  // ws.send(job.data.message);
  app.publish('/events', job.data);
}, {connection: redisConfig});

socketWorker.on('completed', (job) => {
  console.log(`Socket job ${job.id} completed`);
})

socketWorker.on('failed', (job, err) => {
  console.error(`Socket job ${job.id} failed with error:`, err);
});

console.log('socket worker process initialized');