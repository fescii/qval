// Importing within the app
const { validateTopicData } = require('../validators').topicValidator;
const { checkIfTopicExists } = require('../queries').topicQueries;

const checkDuplicateTopic = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.body) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }
  
  // Get user data from request body
  const payload = req.body;
  
  const {
    data,
    error
  } = await validateTopicData(payload);
  
  // Handling data validation error
  if (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
  
  const {
    topic,
    err
  } = await checkIfTopicExists(data.name, data.slug);
  
  // Passing the error to error middleware
  if (err) {
    return next(err);
  }
  
  // If a topic already exits, return it
  if (topic) {
    return res.status(409).send({
      success: false,
      topic,
      message: "Failed! topic with similar name or slug already exits!"
    });
  }
  
  // Add the validated data to the request object for the next() function
  req.topic_data = data;
  next();
};

module.exports = {
  checkDuplicateTopic
};