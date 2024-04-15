// Importing middlewares and controllers
const { verifyToken } = require('../middlewares').authMiddleware;
const {
  addOpinion, updateOpinion,
  deleteOpinion
} = require('../controllers').opinionController;


// Function to export all opinion routes
module.exports = (app, url) => {
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  // Route for handling opinion creation
  app.put(`${url}/s/:storyHash/add/opinion`,
    verifyToken,
    addOpinion
  );

  // Route for handling opinion update
  app.patch(`${url}/o/:opinionHash/edit`,
    verifyToken,
    updateOpinion
  );

  // Route for handling opinion deletion
  app.delete(`${url}/o/:opinionHash/remove`,
    verifyToken,
    deleteOpinion
  );
}
