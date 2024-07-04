const { search } = require('./public')
const { trendingStories } = require('./story');
const { trendingReplies } = require('./reply');
const { trendingUsers } = require('./user');
const { trendingTopics } = require('./topic');


module.exports = {
  search, trendingStories, trendingUsers,
  trendingReplies, trendingTopics, 
}