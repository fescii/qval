const { redisConfig } = require('../configs').storageConfig;
const { Worker } = require('bullmq');
const { socketQueue, actionQueue, activityQueue } = require('../bull');
const uWs = require('uWebSockets.js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// import path module
const path = require('path');

const host = process.env['HOST'] || '192.168.68.49';
const port = process.env['PORT'] || 3001;

// let credentials;
// try {
//   credentials = {
//     key_file_name: fs.readFileSync(path.join(__dirname, '../ssl_certs', 'key.pem')),
//     cert_file_name: fs.readFileSync(path.join(__dirname, '../ssl_certs', 'cert.pem')),
//   };
// } catch (error) {
//   console.error('Error reading SSL certificates:', error);
//   process.exit(1);
// }

const credentials = {
  key_file_name: path.join(__dirname, '../ssl_certs', 'key.pem'),
  cert_file_name: path.join(__dirname, '../ssl_certs', 'cert.pem'),
};


// Create the WebSocket server
const app = uWs.SSLApp(credentials).ws('/events', {
// const app = uWs.App().ws('/events', {
  /* Options */
  compression: uWs.SHARED_COMPRESSOR,
  maxPayloadLength: 16 * 1024 * 1024,
  idleTimeout: 960,
  /* Handlers */
  open: (ws, req) => {
    console.log('A WebSocket connected');
    // subscribe to the events topic
    ws.subscribe('/events');
  },
  message: async (ws, message, isBinary) => {
    /* Ok is false if backpressure was built up, wait for drain */
    // let ok = ws.send(message, isBinary);

    // Check if message is defined before publishing
    if (message !== undefined && message !== null) {
      // convert array buffer to sJSON
      const data = JSON.parse(Buffer.from(message).toString('utf-8'));

      // check if it is from frontend and type is action
      if(data.frontend && data.type === 'action') {
        // remove frontend from the data
        delete data.frontend;

        // add the message to the actionQueue
        await actionQueue.add('actionJob', data.data, { attempts: 3, backoff: 1000, removeOnComplete: true });
      }
      else {
        await ws.publish('/events', message);
      }
    }
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
}).listen(host, port, (listenSocket) => {
  if (listenSocket) {
    console.log(`Listening on wss://${host}:${port}`);
  } else {
    console.error(`Failed to listen to port ${port}`);
  }
});



// Initialize the Bull worker for the socketQueue
const socketWorker = new Worker('socketQueue', async (job) => {
  console.log('========Processing socket job =====================');
  // console.log(job.data);
  console.log('==================================================');
  
  // Send the message to the WebSocket server
  // !Todo - Implement the WebSocket to send received messages to the client
  // prepare the message to be sent to the client
  const data = JSON.stringify(job.data);
  app.publish('/events', data);
}, {connection: redisConfig});

socketWorker.on('completed', (job) => {
  console.log(`Socket job ${job.id} completed`);
})

socketWorker.on('failed', (job, err) => {
  console.error(`Socket job ${job.id} failed with error:`, err);
});

console.log('socket worker process initialized');