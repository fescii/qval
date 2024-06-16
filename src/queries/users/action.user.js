// Import the models
const { Connect, sequelize } = require('../../models').models;


/**
 * @function followUser
 * @description Query to follow or unfollow a user
 * @param {String} from - The hash of the user following the topic
 * @param {String} to - The hash of the topic to follow
 * @returns {Object} - The follow object or null, and the error if any
*/
const followUser = async (from, to) => {
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

    // if the follow object was created: return follow: true, else return follow: false
    return { followed: created, error: null };
  }
  catch (error) {
    return { follow: null, error };
  }
}

module.exports = {
  followUser,
};