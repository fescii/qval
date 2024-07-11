// import all queries from the storyQueues
const {
  fetchTrending
} = require('../../queries').feedQueries;

/**
 * @function getTrending
 * @description Controller for finding all feeds
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getTrending = async(req, res, next) => {
  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  // Find the stories
  const {
    data,
    error
  } = await fetchTrending(user);

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
  getTrending
}