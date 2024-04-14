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

  // Check if the story kind is not post and is not poll
  if (valObj.data.kind !== 'post' && valObj.data.kind !== 'poll') {
    // Check if a story already exists
    const {
      story,
      error
    } = await checkIfStoryExists(valObj.data.slug);

    // Passing the error to error middleware
    if (error) {
      return next(error);
    }

    // If a story already exits, return it
    if (story) {
      return res.status(400).send({
        success: false,
        message: 'Story with similar slug - link - already exists!'
      });
    }
  }

  // Add the validated data to the request object for the next() function
  req.story_data = valObj.data;
  await next();
}

module.exports = {
  checkDuplicateStory
};