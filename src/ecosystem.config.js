const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  apps: [
    {
      name: 'express-app',
      script: 'app.js', // Replace with your main Express server file
      watch: true,
      ignore_watch: ['node_modules', 'logs', 'uploads', 'public'], // Ignore specific directories for file watching
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'action-worker',
      script: './workers/action.worker.js', // Replace with your Bull worker file
      watch: true,
      ignore_watch: ['node_modules', 'logs', 'uploads', 'public'], // Ignore specific directories for file watching
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'mail-worker',
      script: './workers/mail.worker.js', // Replace with your Bull worker file
      watch: true,
      ignore_watch: ['node_modules', 'logs', 'uploads', 'public'], // Ignore specific directories for file watching
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
  ]
};
