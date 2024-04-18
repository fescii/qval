const { errorController } = require('../controllers');

/**
 * @function errorRoutes
 * @description a modular function that registers all the error routes
 * @param {Object} app - The express app
*/
module.exports =  (app) => {
  app.use(errorController.notFound);
  app.use(errorController.errorHandler);
};