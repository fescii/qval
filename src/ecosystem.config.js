const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  apps: [
    {
      name: 'express-app',
      script: 'app.js',
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
      script: './workers/action.js',
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
      script: './workers/mail.js',
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
      name: 'activity-worker',
      script: './workers/activity.js',
      watch: true,
      ignore_watch: ['node_modules', 'logs', 'uploads', 'public'], // Ignore specific directories for file watching
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
