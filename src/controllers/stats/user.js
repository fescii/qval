// import user stat queries from queries
const { userStats , storyStats, replyStats } = require('../../queries').statsQueries;

const  {
  getTotalPreviousMonthUserViews,  getTotalUserViewsThisMonth,
  getTotalTopicsUserIsSubscribedTo, getTotalUserViews, 
  // getTotalUserRepliesViews, getTotalUserStoriesViews
} = userStats

const { 
  totalStoryLikesPreviousMonth, totalStoryLikesThisMonth,
  totalStoryPreviousMonthViews, totalStoryRepliesPreviousMonth, totalStoryRepliesThisMonth,
  totalStoryViewsThisMonth,
} = storyStats;
const { 
  totalReplyLikesLastMonth, totalReplyLikesThisMonth, 
  totalReplyPreviousMonthViews, 
  totalReplyRepliesLastMonth, 
  totalReplyRepliesThisMonth, 
  totalReplyViewsThisMonth
} = replyStats;


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


/**
 * @function getUserAllStats
 * @description Controller function to fetch and return user statistics.
 * @param {Request} req - The request object from Express.js.
 * @param {Response} res - The response object from Express.js.
 * @param {Function} next - The next middleware to pass error whenever any error occurs
 * @returns {Response} json - Returns a json response
*/
const getUserAllStats = async(req, res, next) => {
  //check for params
  if (!req.user) {
    return next(new Error('The user hash was not defined!.'))
  }

  const hash = req.user.hash

  try {
    // get story likes and views, and replies
    const storyLikesLastMonth = await totalStoryLikesPreviousMonth(hash.toUpperCase());
    const storyLikesThisMonth = await totalStoryLikesThisMonth(hash.toUpperCase());
    const storyViewsLastMonth = await totalStoryPreviousMonthViews(hash.toUpperCase());
    const storyRepliesLastMonth = await totalStoryRepliesPreviousMonth(hash.toUpperCase());
    const storyRepliesThisMonth = await totalStoryRepliesThisMonth(hash.toUpperCase());
    const storyViewsThisMonth = await totalStoryViewsThisMonth(hash.toUpperCase());

    // get reply likes and views, and replies
    const replyLikesLastMonth = await totalReplyLikesLastMonth(hash.toUpperCase());
    const replyLikesThisMonth = await totalReplyLikesThisMonth(hash.toUpperCase());
    const replyViewsLastMonth = await totalReplyPreviousMonthViews(hash.toUpperCase());
    const replyRepliesLastMonth = await totalReplyRepliesLastMonth(hash.toUpperCase());
    const replyRepliesThisMonth = await totalReplyRepliesThisMonth(hash.toUpperCase());
    const replyViewsThisMonth = await totalReplyViewsThisMonth(hash.toUpperCase());

    const data = {
      story: {
        likes: {
          last: parseInt(storyLikesLastMonth[0].total_likes),
          current: parseInt(storyLikesThisMonth[0].total_likes)
        },
        views: {
          last: storyViewsLastMonth,
          current: storyViewsThisMonth
        },
        replies: {
          last: parseInt(storyRepliesLastMonth[0].total_replies),
          current: parseInt(storyRepliesThisMonth[0].total_replies)
        }
      },
      reply: {
        likes: {
          last: parseInt(replyLikesLastMonth[0].total_likes),
          current: parseInt(replyLikesThisMonth[0].total_likes)
        },
        views: {
          last: replyViewsLastMonth,
          current: replyViewsThisMonth
        },
        replies: {
          last: parseInt(replyRepliesLastMonth[0].total_replies),
          current: parseInt(replyRepliesThisMonth[0].total_replies)
        }
      }
    }
    
    return res.status(200).json({
      success: true,
      data: data,
      message: "The stats retrived successfully!"
    })
  } 
  catch (error) {
    return next(error)
  }
}

module.exports = {
  getUserStats, getUserAllStats
}