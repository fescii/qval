// import all queries from the storyQueues
const {
  findTrendingStories, findStoriesByQuery
} = require('../../queries').searchQueries;

/**
 * @function trendingStories
 * @description Controller for finding all trending stories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const trendingStories = async(req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    user,
    page: parseInt(page),
    limit: 10
  }

  // Find the stories
  const {
    data,
    error
  } = await findTrendingStories(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.stories.length === 0 ? 'No stories found!' : 'Stories found!',
    data
  });
}

/**
 * @function searchStories
 * @description Controller for searching stories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || next middleware || error
*/
const searchStories = async(req, res, next) => {
  // get the search query
  const query = req.query.q;

  // get the page
  let page = req.query.page || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    query,
    user,
    page: parseInt(page),
    limit: 10
  }

  // Find the stories
  const {
    data,
    error
  } = await findStoriesByQuery(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.stories.length === 0 ? 'No stories found!' : 'Stories found!',
    data
  });
}

// export the controllers
module.exports = {
  trendingStories, searchStories
}