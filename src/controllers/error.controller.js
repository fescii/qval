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
  const errorMsg = err.message || 'Something went wrong!'

  if (err instanceof multer.MulterError) {
    res.status(400).json({
      success: false,
      error: true,
      message: err.message,
      stack: envConfig.node_env === 'development' ? err.stack : {}
    });
  }
  else {
    return res.status(errorStatus).send({
    success: false,
    error: true,
    stack_message: errorMsg,
    message: "Something went wrong!",
    stack: envConfig.node_env === 'development' ? err.stack : {}
  });
  }
}


/**
 * Not found middleware - Captures all requests to unknown routes
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 */
const notFound = (req, res, _next) => {
  res.status(404).json({
    success: false,
    error: true,
    message: "Resource not found!"
  });
}

/**
 * Exporting the error handler and not found middleware
 */
module.exports = {
  errorHandler, notFound
}