const { validateStoryData } = require('../validators').storyValidator;
const { checkIfStoryExists } = require('../queries').storyQueries;

const checkDuplicateStory = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  const payload = req.body;

  const valObj = await validateStoryData(payload);

  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Check if a story already exists
  const {
    story,
    error
  } = await checkIfStoryExists(valObj.data.slug);

  req.story_data = valObj.data;



  // Call next() to proceed to the next middleware or route handler
  next();
}

module.exports = {
  checkDuplicateStory
};