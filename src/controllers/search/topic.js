// import all queries from the storyQueues
const {
  findTrendingTopics, findTopicsByQuery
} = require('../../queries').searchQueries;

/**
 * @function trendingTopics
 * @description Controller for finding all trending topics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || next middleware || error
*/
const trendingTopics = async(req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;
  let limit = req.query.limit || 10;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    user,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  }

  // Find the topics
  const {
    data,
    error
  } = await findTrendingTopics(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.topics.length === 0 ? 'No topics found!' : 'Topics found!',
    data
  });
}

/**
 * @function searchTopics
 * @description Controller for finding all topics by query
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || next middleware || error
*/
const searchTopics = async(req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;

  // get the query from the request object
  const query = req.query.q;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    user,
    query,
    page: page = parseInt(page, 10) || 1,
    limit: 10
  }

  // Find the topics
  const {
    data,
    error
  } = await findTopicsByQuery(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.topics.length === 0 ? 'No topics found!' : 'Topics found!',
    data
  });
}

// export the controllers
module.exports = {
  trendingTopics, searchTopics
}