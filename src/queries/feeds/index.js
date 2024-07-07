const { fetchFeeds } = require('./feed');
const { fetchRecent } = require('./recent');
const { fetchTrending } = require('./trending')


// Export the feeds queries
module.exports = {
  fetchFeeds, fetchRecent, fetchTrending
}