// import Activity 
const { Activity } = require('../../models').models;


/**
 * @function readActivity
 * @name readActivity
 * @description A function that updates the read status of an activity from unread to read or vice versa
 * @param {Number} activityId - The activity id
 * @param {Boolean} status - The status of the activity
 * @returns {Promise<Boolean>} - Returns the updated status of the activity
*/
const readActivity = async (activityId, status) => {
  try {
    // Find the activity
    const activity = await Activity.findByPk(activityId);

    // if the activity does not exist
    if (!activity) return false;

    // Update the activity status
    activity.status = status;
    // Save the activity
    await activity.save();
    // Return true
    return true
  } catch (error) {
    throw error;
  }
}

/**
 * @function deleteActivity
 * @name deleteActivity
 * @description A function that deletes an activity
 * @param {Number} activityId - The activity id
 * @returns {Promise<Boolean>} - Returns the true if the activity was deleted successfully and false otherwise
*/
const deleteActivity = async (activityId) => {
  try {
    // Find the activity
    const activity = await Activity.findByPk(activityId);

    // if the activity does not exist
    if (!activity) return false;

    // Change deleted status
    activity.deleted = true;

    // Save the activity
    await activity.save();
    // Return true
    return true;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  readActivity,
  deleteActivity
}