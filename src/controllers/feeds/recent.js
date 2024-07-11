// import all queries from the storyQueues
const {
  fetchRecent
} = require('../../queries').feedQueries;

/**
 * @function getRecent
 * @description Controller for finding all recent stories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const getRecent = async(req, res, next) => {
  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  // Find the stories
  const {
    stories,
    error
  } = await fetchRecent(user);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: 'Recent stories fetched successfully',
    stories
  });
}


// export the controllers
module.exports = {
  getRecent
}