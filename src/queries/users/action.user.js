// Import the models
const { Connect, sequelize } = require('../../models').models;


/**
 * @function connectToUser
 * @description Query to follow or unfollow a user
 * @param {String} from - The hash of the user following the topic
 * @param {String} to - The hash of the topic to follow
 * @returns {Object} - The follow object or null, and the error if any
*/
const connectToUser = async (from, to) => {
  try {
    // get or create the follow object
    const [follow, created] = await Connect.findOrCreate({
      where: {
        from,
        to
      },
      defaults: {
        from,
        to
      }
    });

    // if the follow object was created: return true
    if (created) {
      return { followed: true, error: null };
    }
    else {
      // if the follow object was not created: delete it
      await follow.destroy();
      return { followed: false, error: null };
    }
  }
  catch (error) {
    return { followed: null, error };
  }
}

module.exports = {
  connectToUser,
};