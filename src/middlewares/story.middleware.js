const { 
  validateStory, validateContent, validateReply, validateReplyContent, 
  validateSection, validateSectionContent, validateSlug, validateTitle
 } = require('../validators').storyValidator;
const { checkIfStoryExists } = require('../queries').storyQueries;

/**
 * @function checkStory
 * @name checkStory
 * @description This middleware checks if a story with similar slug exists
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkStory = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the request!');
    return next(error);
  }

  const payload = req.body;

  const valObj = await validateStory(payload);

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
  req.story = valObj.data;
  await next();
}

/**
 * @function checkSlug
 * @name checkSlug
 * @description This middleware validates the story slug: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object || or next middleware function
*/
const checkSlug = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the request!');
    return next(error);
  }

  const payload = req.body;

  const valObj = await validateSlug(payload);

  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Add the validated data to the request object for the next() function
  req.story = valObj.data;
  await next();
}

/**
 * @function checkTitle
 * @name checkTitle
 * @description This middleware validates the story title: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object || or next middleware function
*/
const checkTitle = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the request!');
    return next(error);
  }

  const payload = req.body;

  const valObj = await validateTitle(payload);

  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Add the validated data to the request object for the next() function
  req.story = valObj.data;
  await next();
}

/**
 * @function checkContent
 * @name checkContent
 * @description This middleware validates the story content: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkContent = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  const payload = req.body;

  const valObj = await validateContent(payload);

  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Add the validated data to the request object for the next() function
  req.story = valObj.data;
  await next();
}

/**
 * @function checkReply
 * @name checkReply
 * @description This middleware validates the story reply: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkReply = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  const payload = req.body;

  const valObj = await validateReply(payload);

  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Add the validated data to the request object for the next() function
  req.reply = valObj.data;
  await next();
}

/**
 * @function checkSection
 * @name checkSection
 * @description This middleware validates the story section: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkSection = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  const payload = req.body;

  const valObj = await validateSection(payload);

  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Add the validated data to the request object for the next() function
  req.section = valObj.data;
  await next();
}

/**
 * @function checkReplyContent
 * @name checkReplyContent
 * @description This middleware validates the story reply: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkReplyContent = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  const payload = req.body;

  const valObj = await validateReplyContent(payload);

  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Add the validated data to the request object for the next() function
  req.reply = valObj.data;
  await next();
}

/**
 * @function checkSectionContent
 * @name checkSectionContent
 * @description This middleware validates the story section: DATA before being passed to the controllers or other middlewares
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const checkSectionContent = async(req, res, next) => {
  //Check if the payload is available in the request object
  if (!req.body || !req.user) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  const payload = req.body;

  const valObj = await validateSectionContent(payload);

  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Add the validated data to the request object for the next() function
  req.section = valObj.data;
  await next();
}

/**
 * Exporting the middlewares as a single object
*/
module.exports = {
  checkStory, checkContent, checkReply, checkSection, 
  checkReplyContent, checkSectionContent, checkSlug, checkTitle
};