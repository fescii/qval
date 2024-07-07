const { getFeeds } = require('./feed');
const { getRecent } = require('./recent');
const { home } = require('./public');
const { getTrending } = require('./trending');


// Export the feeds controllers
module.exports = {
  getFeeds, getRecent, home, getTrending
}