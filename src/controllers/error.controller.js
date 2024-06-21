const multer = require('multer');
const { envConfig } = require('../configs');

const {
  host, port
} = require('../configs').envConfig;

const address = `${host}:${port}`;

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
    if (req.url.startsWith('/api/')){
      return res.status(errorStatus).json({
        success: false,
        error: true,
        message: err.message,
        stack: envConfig.node_env === 'development' ? err.stack : {}
      });
    }
    else {
      return res.status(errorStatus).render('500')
    }
  }
  else {
    if (req.url.startsWith('/api/')){
      return res.status(errorStatus).send({
        success: false,
        error: true,
        stack_message: errorMsg,
        message: "Something went wrong!",
        stack: envConfig.node_env === 'development' ? err.stack : {}
      });
    }
    else {
      return res.status(errorStatus).render('500')
    }
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