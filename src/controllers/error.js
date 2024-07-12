const multer = require('multer');
const { envConfig } = require('../configs');

/**
 * @function errorHandler
 * @description Error handler middleware for capturing all errors and sends a response to the user
 * @param {Object} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
 */
const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);
  const errorStatus = err.status || 500;

  let errorMessage;
  let stackMessage;

  if (err instanceof multer.MulterError) {
    errorMessage = err.message;
    stackMessage = envConfig.node_env === 'development' ? err.stack : {};
  } else if (err.name === 'SequelizeValidationError') {
    errorMessage = err.errors.map(error => error.message);
    stackMessage = envConfig.node_env === 'development' ? err.stack : {};
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    errorMessage = 'There is a conflict with the action!';
    stackMessage = envConfig.node_env === 'development' ? err.stack : {};
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    errorMessage = 'The action data is not found!';
    stackMessage = envConfig.node_env === 'development' ? err.stack : {};
  } else if (err.name === 'SequelizeDatabaseError') {
    errorMessage = 'Internal error! Please try again later!';
    stackMessage = envConfig.node_env === 'development' ? err.stack : {};
  } else {
    errorMessage = 'Something went wrong!';
    stackMessage = envConfig.node_env === 'development' ? err.stack : {};
  }

  const response = {
    success: false,
    error: true,
    message: errorMessage,
    stack: stackMessage
  };

  if (req.url.startsWith('/api/')) {
    return res.status(errorStatus).json(response);
  } else {
    return res.status(errorStatus).render('500');
  }
}

/**
 * Not found middleware - Captures all requests to unknown routes
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} _next - Next middleware function
 * @returns {Object} - Returns response object
 */
const notFound = (req, res, _next) => {
  // Check if the url start with "/api/"
  if (req.url.startsWith('/api/')){
    return res.status(404).json({
      success: false,
      error: true,
      message: "Resource not found!"
    });
  }
  else {
    return res.status(404).render('404')
  }
}

/**
 * Exporting the error handler and not found middleware
 */
module.exports = {
  errorHandler, notFound
}