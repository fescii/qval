// import all queries from the storyQueues
const {
  fetchFeeds
} = require('../../queries').feedQueries;

/**
 * @function getFeeds
 * @description Controller for finding all feeds
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getFeeds = async(req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    user,
    page: parseInt(page),
    limit: 6
  }

  // Find the stories
  const {
    data,
    error
  } = await fetchFeeds(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: 'Feeds fetched successfully',
    data
  });
}


// export the controllers
module.exports = {
  getFeeds
}