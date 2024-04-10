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
  
  const valObj = await validateTopicData(payload);
  
  // Handling data validation error
  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }
  
  console.log(valObj)
  
  
  const {
    topic,
    error
  } = await checkIfTopicExists(valObj.data.name, valObj.data.slug);
  
  // console.log(topic)
  
  // Passing the error to error middleware
  if (error) {
    return next(error);
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
  req.topic_data = valObj.data;
  next();
};

module.exports = {
  checkDuplicateTopic
};