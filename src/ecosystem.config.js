const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  apps: [
    {
      name: 'express-app',
      script: 'app.js', // Replace with your main Express server file
      watch: true,
      ignore_watch: ['node_modules', 'logs', 'uploads'], // Ignore specific directories for file watching
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'upvote-worker',
      script: './workers/upvote.worker.js', // Replace with your Bull worker file
      watch: true,
      ignore_watch: ['node_modules', 'logs', 'uploads'], // Ignore specific directories for file watching
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    // Add more apps/workers as needed
  ]
};
