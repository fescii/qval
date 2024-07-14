// import follow and subscribe queries
const { deleteActivity, readActivity } = require('../../queries').activityQueries;

/**
 * @function readingActivity
 * @description Controller to update the read status of an activity from unread to read or vice versa
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const readingActivity = async (req, res, next) => {
  // check if payload is valid
  if (!req.user || !req?.params?.status || !req?.params?.id) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  const {id, status} = req.params;

  try {
    // try converting id to number and status('true' or 'false') to boolean
    let parsedId = parseInt(id);
    let bool_status = status === 'true';


    // Get the activity
    const activity = await readActivity(parsedId, bool_status);

    // return success message
    return res.status(200).send({
      success: true,
      status: activity,
      message: activity ? 'Activity has been updated!' : 'Activity not found!'
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @function deletingActivity
 * @description Controller to delete an activity from the database
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object || pass error to next middleware
*/
const deletingActivity = async (req, res, next) => {
  // check if payload is valid
  if (!req.user || !req?.params?.id) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  const {id} = req.params;

  try {
    // try converting id to number
    let parsedId = parseInt(id);

    // Get the activity
    const activity = await deleteActivity(parsedId);

    // return success message
    return res.status(200).send({
      success: true,
      status: activity,
      message: activity ? 'Activity has been deleted!' : 'Activity not found!'
    });
  } catch (error) {
    return next(error);
  }
}

// Export all topic actions
module.exports = {
  readingActivity, deletingActivity
};