// hook fns: functions to udate hooks data in the database
const {
  updateTopicFollowers, updateTopicSubscribers, 
  updateUserFollowers, updateUserFollowing
} = require('./fns.hook');

/**
 * @function actionHook
 * @name actionHook
 * @description A Hook function that updates user: (followers, following) data
 * topic: (followers, views, subscribers) data, story (views, upvotes) data.
 * @param {Object} data - Data object (user, topic, story)
 * @returns {Promise<void>} - Returns a promise of void data
*/
const actionHook = async data => {
  // check if data is available and contains kind field
  if (!data || !data.kind || !data.action) {
    // Log the error
    console.error('Data is undefined. Cannot initialize action hook process');

    console.log('Data:', data);
    return;
  }

  // Log the process initialization
  console.log('Action hook process initialized');

  // Try to update the user, topic or story data
  try {
    // switch the kind of data
    switch (data.kind) {
      case 'user':
        // Get the the hashes
        const {from, to} = data.hashes;

        // Check action from data
        if (data.action === 'connect') {
          // Update the user followers and following
          await updateUserFollowers(to, data.value);
          await updateUserFollowing(from, data.value);
        }
        // other actions can be added here
        break;
      case 'topic':
        const {topic} = data.hashes;
        // Check action from data
        if (data.action === 'subscribe') {
          // Update the topic subscribers
          await updateTopicSubscribers(topic, data.value);
        }
        else if (data.action === 'follow') {
          // Update the topic followers
          await updateTopicFollowers(topic, data.value);
        }
        break;
      default:
        // Log the error
        console.error('Data kind is not defined. Cannot initialize action hook process');
        break;
    }

    // Log the process completion
    console.log('Action hook process completed');
  }
  catch (error) {
    console.error('Error initializing action hook process:', error);

    // !TODO: Create a handler for handling this error
  }
}


// Export all hooks
module.exports = {
  actionHook
}