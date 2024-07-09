// import all queries from the stats folder
const userStats = require('./user');
const topicStats = require('./topic');
const storyStats = require('./story');
const replyStats = require('./reply');


// export all the queries
module.exports = {
  userStats, topicStats,
  storyStats, replyStats
}