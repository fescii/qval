// import user Model from models
const { User, sequelize, Sequelize } = require('../models').models;

/**
 * @function updateUserFollowers
 * @name updateUserFollowers
 * @description A function that updates the user followers data
 * @param {String} userHash 
 * @param {Number} value 
*/
const updateUserFollowers = async (userHash, value) => {
  if (!userHash || !value || typeof value !== 'number') {
    // throw an error
    throw new Error('User hash and value are required!, value must be a number');
  }

  // value can be -1 or 1
  if (value !== -1 && value !== 1) {
    // throw an error
    throw new Error('Value can only be -1 or 1');
  }

  // Update the user followers by the value: followers + 1 or followers - 1
  await User.update(
    { followers: Sequelize.literal(`followers + ${value}`)}, 
    { where: { hash: userHash } 
  });
}


/**
 * @function updateUserFollowing
 * @name updateUserFollowing
 * @description A function that updates the user following data
 * @param {String} userHash
 * @param {Number} value
 * @returns {Promise<void>} - Returns a promise of void data
*/
const updateUserFollowing = async (userHash, value) => {
  if (!userHash || !value || typeof value !== 'number') {
    // throw an error
    throw new Error('User hash and value are required!, value must be a number');
  }

  // value can be -1 or 1
  if (value !== -1 && value !== 1) {
    // throw an error
    throw new Error('Value can only be -1 or 1');
  }

  // Update the user following by the value: following + 1 or following - 1
  await User.update(
    { following: Sequelize.literal(`following + ${value}`)}, 
    { where: { hash: userHash } 
  });
}

/**
 * @function updateTopicFollowers
 * @name updateTopicFollowers
 * @description A function that updates the topic followers data
 * @param {String} topicHash
 * @param {Number} value
 * @returns {Promise<void>} - Returns a promise of void data
*/
const updateTopicFollowers = async (topicHash, value) => {
  if (!topicHash || !value || typeof value !== 'number') {
    // throw an error
    throw new Error('Topic hash and value are required!, value must be a number');
  }

  // value can be -1 or 1
  if (value !== -1 && value !== 1) {
    // throw an error
    throw new Error('Value can only be -1 or 1');
  }

  // Update the topic followers by the value: followers + 1 or followers - 1
  await Topic.update(
    { followers: Sequelize.literal(`followers + ${value}`)}, 
    { where: { hash: topicHash } 
  });
}


/**
 * @function updateTopicSubscribers
 * @name updateTopicSubscribers
 * @description A function that updates the topic subscribers data
 * @param {String} topicHash
 * @param {Number} value
 * @returns {Promise<void>} - Returns a promise of void data
*/
const updateTopicSubscribers = async (topicHash, value) => {
  if (!topicHash || !value || typeof value !== 'number') {
    // throw an error
    throw new Error('Topic hash and value are required!, value must be a number');
  }

  // value can be -1 or 1
  if (value !== -1 && value !== 1) {
    // throw an error
    throw new Error('Value can only be -1 or 1');
  }

  // Update the topic subscribers by the value: subscribers + 1 or subscribers - 1
  await Topic.update(
    { subscribers: Sequelize.literal(`subscribers + ${value}`)}, 
    { where: { hash: topicHash } 
  });
}

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
        if (data.action === 'follow') {
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