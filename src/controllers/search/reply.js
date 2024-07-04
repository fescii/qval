// import all queries from the storyQueues
const {
  findTrendingReplies
} = require('../../queries').searchQueries;

/**
 * @function trendingReplies
 * @description Controller for finding all trending replies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object || next middleware || error
*/
const trendingReplies = async(req, res, next) => {
  // get page from the query
  let page = req.query.page || 1;

  // create user hash from the request object
  const user = req.user ? req.user.hash : null;

  const reqData = {
    user,
    page: page = parseInt(page, 10) || 1,
    limit: 10
  }

  // Find the stories
  const {
    data,
    error
  } = await findTrendingReplies(reqData);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // return the response
  return res.status(200).json({
    success: true,
    message: data.replies.length === 0 ? 'No replies found!' : 'Replies found!',
    data
  });
}

// export the controllers
module.exports = {
  trendingReplies
}