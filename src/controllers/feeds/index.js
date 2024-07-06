const { getFeeds } = require('./feed');
const { getRecent } = require('./recent');
const { home } = require('./public');


// Export the feeds controllers
module.exports = {
  getFeeds, getRecent, home
}