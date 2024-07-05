// import user stat queries from queries
const {
  getTotalPreviousMonthTopicViews, getTotalTopicViewsThisMonth,
} = require('../../queries').statsQueries.topicStats;

/**
 * @function getUserStats
 * @description Controller function to fetch and return user statistics.
 * @param {Request} req - The request object from Express.js.
 * @param {Response} res - The response object from Express.js.
 * @param {Function} next - The next middleware to pass error whenever any error occurs
 * @returns {Response} json - Returns a json response
*/
const getTopicStats = async(req, res, next) => {
  // get user hash from the request params
  const { hash } = req.params

  //check for params
  if (!hash) {
    return next(new Error('The topic hash was not defined!.'))
  }

  try {
    
    // get user previous month views
    const lastMonth = await getTotalPreviousMonthTopicViews(hash.toUpperCase());

    // get this month's views 
    const thisMonth = await getTotalTopicViewsThisMonth(hash.toUpperCase());

    return res.status(200).json({
      success: true,
      data: {
        last: lastMonth,
        current: thisMonth,
      },
      message: "The stats retrived successfully!"
    })
  } 
  catch (error) {
    return next(error)
  }
}

module.exports = {
  getTopicStats
}