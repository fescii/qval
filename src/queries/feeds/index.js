const { fetchFeeds } = require('./feed');
const { fetchRecent } = require('./recent');


// Export the feeds queries
module.exports = {
  fetchFeeds,
  fetchRecent
}