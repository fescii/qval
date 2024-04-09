const { errorController } = require('../controllers');

module.exports =  (app) => {
  app.use(errorController.notFound);
  app.use(errorController.errorHandler);
};