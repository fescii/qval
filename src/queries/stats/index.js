// import all queries from the stats folder
const userStats = require('./user');
const topicStats = require('./topic');


// export all the queries
module.exports = {
  userStats, topicStats
}