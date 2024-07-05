const { search } = require('./public')
const { trendingStories, searchStories } = require('./story');
const { trendingReplies, searchReplies } = require('./reply');
const { trendingUsers } = require('./user');
const { trendingTopics } = require('./topic');


module.exports = {
  search, trendingStories, trendingUsers, searchReplies,
  trendingReplies, trendingTopics, searchStories
}