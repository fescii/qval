const { deletingActivity, readingActivity } = require('./base');
const {
  getActivities, getStoriesActivities,
  getRepliesActivities, getTopicsActivities,
  getPeopleActivities
} = require('./user')
// export all controllers
module.exports = {
  deletingActivity, readingActivity,
  getActivities, getStoriesActivities,
  getRepliesActivities, getTopicsActivities,
  getPeopleActivities
};