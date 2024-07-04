// import all queries from the storyQueues
const {
  findTrendingUsers
} = require('../../queries').searchQueries;

/**
 * @function trendingUsers
 * @description Controller for finding all trending users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || next middleware || error
*/
const trendingUsers = async(req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    user,
    page: page = parseInt(page, 10) || 1,
    limit: 10
  }

  // Find the users
  const {
    data,
    error
  } = await findTrendingUsers(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.people.length === 0 ? 'No users found!' : 'Users found!',
    data
  });
}

// export the controllers
module.exports = {
  trendingUsers
}