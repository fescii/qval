// Import topic queries from storyQueries
const { findStoriesByTopic, findRelatedStories, findTopicContributors } = require('../../queries').storyQueries;

/**
 * @function getTopicStories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @description Get stories by topic
 * @returns {Object} - Returns response object
*/
const getTopicStories = async (req, res, next) => {
  // Get the topic slug from the request object
  const { slug } = req.params;

  // get page and totalStories from the query
  const page = req.query.page || 1;

  // Check if the topic slug is available in the request object
  if (!slug || !page) {
    const error = new Error('Topic slug or page is undefined!');
    return next(error);
  }

  // create user based on the request object
  const user = req.user ? req.user.hash : null;

  // construct reqData object
  const reqData = {
    topic: slug,
    user,
    page: parseInt(page, 10) | 0,
    limit: 10
  };

  // Get stories by topic
  const {
    data,
    error
  } = await findStoriesByTopic(reqData);

  // Check if there is an error
  if (error) {
    return next(error);
  }

  // Check if there is no data
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'No stories found for this topic!'
    });
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.stories ? "Stories found" : "No stories found!",
    data
  })

}

/**
 * @function getRelatedStories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @description Get related stories
 * @returns {Object} - Returns response object
*/
const getRelatedStories = async (req, res, next) => {
  // get page and totalStories from the query
  const page = req.query.page || 1;

  const totalStories = req.query.stories || 10;

  // Check if the queries is available in the request object
  if (!page || !totalStories || !req.body) {
    const error = new Error('Page or totalStories is undefined!');
    return next(error);
  }

  // check if the topics is available in the body and is type of array
  if (!req.body.topics || !Array.isArray(req.body.topics)) {
    const error = new Error('Topics is not available or is not an array!');
    return next(error);
  }

  // create user based on the request object
  const user = req.user ? req.user.hash : null;

  // construct reqData object
  const reqData = {
    topics: req.body.topics,
    user,
    totalStories: parseInt(totalStories, 10) | 0,
    page: parseInt(page, 10) | 0,
    limit: 10
  };

  // Get related stories
  const {
    data,
    error
  } = await findRelatedStories(reqData);

  // Check if there is an error
  if (error) {
    return next(error);
  }

  // Check if there is no data
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'No related stories found for this story!'
    });
  }

   // return the response
   return res.status(200).json({
    success: true,
    message: data.stories ? "Stories found" : "No stories found!",
    data
  })
}

/**
 * @function getTopicContributors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @description Get topic contributors
 * @returns {Object} - Returns response object
*/
const getTopicContributors = async (req, res, next) => {
  // Get the topic slug from the request object
  const { hash } = req.params;

  // get page from the query
  const page = req.query.page || 1;

  // Check if the topic hash is available in the request object
  if (!hash || !page) {
    const error = new Error('Topic hash or page is undefined!');
    return next(error);
  }

  // create user based on the request object
  const user = req.user ? req.user.hash : null;

  // construct reqData object
  const reqData = {
    hash: hash.toUpperCase(),
    user,
    page: 1,
    limit: 10
  };

  // Get topic contributors
  const {
    data,
    error
  } = await findTopicContributors(reqData);

  // Check if there is an error
  if (error) {
    return next(error);
  }

  // Check if there is no data
  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'No contributors found for this topic!'
    });
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.contributors ? "Contributors found" : "No contributors found!",
    data
  })

}

// Export the module
module.exports = {
  getTopicStories, getRelatedStories, getTopicContributors
}