// import user stat queries from queries
const {
  getTotalPreviousMonthUserViews,  getTotalUserViewsThisMonth,
  getTotalTopicsUserIsSubscribedTo, getTotalUserViews
} = require('../../queries').statsQueries.userStats;

/**
 * @function getUserStats
 * @description Controller function to fetch and return user statistics.
 * @param {Request} req - The request object from Express.js.
 * @param {Response} res - The response object from Express.js.
 * @param {Function} next - The next middleware to pass error whenever any error occurs
 * @returns {Response} json - Returns a json response
*/
const getUserStats = async(req, res, next) => {
  // get user hash from the request params
  const { hash } = req.params

  //check for params
  if (!hash) {
    return next(new Error('The user hash was not defined!.'))
  }

  try {
    // get all time user views
    const all = await  getTotalUserViews(hash.toUpperCase())
    
    // get user previous month views
    const lastMonth = await getTotalPreviousMonthUserViews(hash.toUpperCase());

    // get this month's views 
    const thisMonth = await  getTotalUserViewsThisMonth(hash.toUpperCase());

    const topics = await getTotalTopicsUserIsSubscribedTo(hash.toUpperCase())

    return res.status(200).json({
      success: true,
      data: {
        all: all,
        last: lastMonth,
        current: thisMonth,
        topics: topics
      },
      message: "The stats retrived successfully!"
    })
  } 
  catch (error) {
    return next(error)
  }
}

module.exports = {
  getUserStats
}