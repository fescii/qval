const { search } = require('./public')
const { trendingStories, searchStories } = require('./story');
const { trendingReplies, searchReplies } = require('./reply');
const { trendingUsers, searchUsers } = require('./user');
const { trendingTopics, searchTopics } = require('./topic');


module.exports = {
  search, trendingStories, trendingUsers, searchReplies,
  trendingReplies, trendingTopics, searchStories, searchTopics,
  searchUsers
}