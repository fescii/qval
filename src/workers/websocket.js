const { redisConfig } = require('../configs').storageConfig;
const { Worker } = require('bullmq');
const { host } = require('../configs').envConfig;
const { socketQueue } = require('../bull');

const { WebSocketServer, WebSocket } = require('ws');
const {  createServer }  = require('https');
const  { readFileSync } = require('fs');
const { resolve } = require('path');



// Create the server
const server = createServer({
  key: readFileSync(resolve(__dirname, '../certs/server.key')),
  cert: readFileSync(resolve(__dirname, '../certs/server.cert'))
});

// Create the WebSocket server with the server: with port 3001
const wss = new WebSocketServer({
  path: `/wss:${host}/ws/actions`,
  server,
});


// Initialize the WebSocket server
wss.on('connection', ws => {
  console.log('New WebSocket connection');

  // Handle incoming messages
  ws.on('message', message => {
    console.log(`Received message => ${message}`);

    // pass the message to the socketQueue
    socketQueue.add('socketJob', JSON.parse(message), { removeOnComplete: true });
  });

  // Handle closing connections
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  // Handle errors
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

// Start the server
server.listen(3001, () => {
  console.log('WebSocket server started on port 3001');
});



// Initialize the Bull worker for the socketQueue
const socketWorker = new Worker('socketQueue', async (job) => {
  console.log('========Processing socket job =====================');
  console.log(job.data);
  console.log('==================================================');
  
  // Send the message to the WebSocket server
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(job.data));
    }
  })
}, {connection: redisConfig});

socketWorker.on('completed', (job) => {
  console.log(`Socket job ${job.id} completed`);
})

socketWorker.on('failed', (job, err) => {
  console.error(`Socket job ${job.id} failed with error:`, err);
});

console.log('socket worker process initialized');