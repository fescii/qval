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

  // check if the error is an instance of multer error
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
  // check if the error is sequelize error
  else if (err.name === 'SequelizeValidationError') {
    let errors = err.errors.map(error => error.message);
    if (req.url.startsWith('/api/')){
      return res.status(errorStatus).json({
        success: false,
        error: true,
        message: errors,
        stack: envConfig.node_env === 'development' ? err.stack : {}
      });
    }
    else {
      return res.status(errorStatus).render('500')
    }
  }

  // check if the error is a sequlize unique constraint error
  else if (err.name === 'SequelizeUniqueConstraintError') {
    if (req.url.startsWith('/api/')){
      return res.status(errorStatus).json({
        success: false,
        error: true,
        message: 'There is a conflict with the action!',
        stack: envConfig.node_env === 'development' ? err.stack : {}
      });
    }
    else {
      return res.status(errorStatus).render('500')
    }
  }

  // check if the error is a sequlize foreign key constraint error
  else if (err.name === 'SequelizeForeignKeyConstraintError') {
    if (req.url.startsWith('/api/')){
      return res.status(errorStatus).json({
        success: false,
        error: true,
        message: 'The action data is not found!',
        stack: envConfig.node_env === 'development' ? err.stack : {}
      });
    }
    else {
      return res.status(errorStatus).render('500')
    }
  }

  // check if the error is a sequlize database error
  else if (err.name === 'SequelizeDatabaseError') {
    if (req.url.startsWith('/api/')){
      return res.status(errorStatus).json({
        success: false,
        error: true,
        message: 'Internal error! Please try again later!',
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