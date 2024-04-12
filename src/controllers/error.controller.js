const { envConfig } = require('../configs');

//Error handler
const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);
  const errorStatus = err.status || 500;
  const errorMsg = err.message || 'Something went wrong!'

  return res.status(errorStatus).send({
    success: false,
    error: true,
    stack_message: errorMsg,
    message: "Something went wrong!",
    stack: envConfig.node_env === 'development' ? err.stack : {}
  });
}

const notFound = (req, res, _next) => {
  res.status(404).json({
    success: false,
    error: true,
    message: "Resource not found!"
  });
}

module.exports = {
  errorHandler, notFound
}