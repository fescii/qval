// Impoert all the queries from the users and export them
const userEditQueries = require('./edit.user');
const userActionQueries = require('./action.user');
const userBaseQueries = require('./base.user');

module.exports = {
  userEditQueries, userActionQueries, userBaseQueries
};