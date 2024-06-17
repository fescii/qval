// Importing within the app
const { checkIfTopicExists } = require('../queries').topicQueries;
const { mapRequestMethod } = require('../configs');
const { checkAuthority } = require('../utils').roleUtil;


/**
 * @function checkDuplicateTopic
 * @name checkDuplicateTopic
 * @description This middleware checks if a topic with similar name or slug exists
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
 *
*/
const checkDuplicateTopic = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // Get user data from request body
  const payload = req.body;

  const valObj = await validateTopic(payload);

  // Handling data validation error
  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Check if a topic already exists
  const {
    topic,
    error
  } = await checkIfTopicExists(valObj.data.name, valObj.data.slug);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // If a topic already exits, return it
  if (topic) {
    return res.status(409).send({
      success: false,
      topic: {
        author: topic.author,
        name: topic.name,
        slug: topic.slug,
        hash: topic.hash,
        about: topic.about
      },
      message: "Failed! topic with similar name or slug already exits!"
    });
  }

  // Add the validated data to the request object for the next() function
  req.topic = valObj.data;
  return next();
};


/**
 * @function checkTopicUpdatePrivilege
 * @name checkTopicUpdatePrivilege
 * @description This middleware checks if a user has the privilege to update a topic
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkTopicActionPrivilege = async (req, res, next) => {
  // Check if the user is available in the request object
  if (!req.user || !req.params || !req.body) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // Get user data from request object
  const user = req.user;

  // get topic hash from request params
  const hash = req.params.hash;

  // Create access data - (For authorizing user)
  const access = {
    section: hash,
    privilege: await mapRequestMethod(req.method),
    user: user.id,
    key: 'action'
  }

  // Check if the user has the privilege to update the topic
  const hasAccess = await checkAuthority(access);

  // If the user has the privilege, proceed to the next middleware
  if (hasAccess) {
    return next();
  }

  // If user is not authorized return unauthorized
  return res.status(403).send({
    success: false,
    message: "You are not authorized to update this topic!"
  });
};

/**
 * Exporting all the middlewares as an object
*/
module.exports = {
  checkDuplicateTopic, checkTopicActionPrivilege
};