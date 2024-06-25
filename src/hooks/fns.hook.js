const { User, Topic, Story, Reply, View, sequelize, Sequelize } = require('../models').models;

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
 * @function updateTopicViews
 * @name updateTopicViews
 * @description A function that updates the topic views data
 * @param {String} topicHash
 * @param {Number} value
 * @returns {Promise<void>} - Returns a promise of void data
*/
const updateTopicViews = async (topicHash, value) => {
  if (!topicHash || !value || typeof value !== 'number') {
    // throw an error
    throw new Error('Topic hash and value are required!, value must be a number');
  }

  // value can be -1 or 1
  if (value !== -1 && value !== 1) {
    // throw an error
    throw new Error('Value can only be -1 or 1');
  }

  // Update the topic views by the value: views + 1 or views - 1
  await Topic.update(
    { views: Sequelize.literal(`views + ${value}`)}, 
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
 * @function updateStoryLikes
 * @name updateStoryLikes
 * @description A function that updates the story likes data
 * @param {String} storyHash
 * @param {Number} value
 * @returns {Promise<void>} - Returns a promise of void data
*/
const updateStoryLikes = async (storyHash, value) => {
  if (!storyHash || !value || typeof value !== 'number') {
    // throw an error
    throw new Error('Story hash and value are required!, value must be a number');
  }

  // value can be -1 or 1
  if (value !== -1 && value !== 1) {
    // throw an error
    throw new Error('Value can only be -1 or 1');
  }

  // Update the story likes by the value: likes + 1 or likes - 1
  await Story.update(
    { likes: Sequelize.literal(`likes + ${value}`)}, 
    { where: { hash: storyHash } 
  });
}

/**
 * @function updateStoryViews
 * @name updateStoryViews
 * @description A function that updates the story views data
 * @param {String} storyHash
 * @param {Number} value
 * @returns {Promise<void>} - Returns a promise of void data
*/
const updateStoryViews = async (storyHash, value) => {
  if (!storyHash || !value || typeof value !== 'number') {
    // throw an error
    throw new Error('Story hash and value are required!, value must be a number');
  }

  // value can be -1 or 1
  if (value !== -1 && value !== 1) {
    // throw an error
    throw new Error('Value can only be -1 or 1');
  }

  // Update the story views by the value: views + 1 or views - 1
  await Story.update(
    { views: Sequelize.literal(`views + ${value}`)}, 
    { where: { hash: storyHash } 
  });
}

/**
 * @function updateStoryReplies
 * @name updateStoryReplies
 * @description A function that updates the story replies data
 * @param {String} storyHash
 * @param {Number} value
 * @returns {Promise<void>} - Returns a promise of void data
*/
const updateStoryReplies = async (storyHash, value) => {
  if (!storyHash || !value || typeof value !== 'number') {
    // throw an error
    throw new Error('Story hash and value are required!, value must be a number');
  }

  // value can be -1 or 1
  if (value !== -1 && value !== 1) {
    // throw an error
    throw new Error('Value can only be -1 or 1');
  }

  // Update the story replies by the value: replies + 1 or replies - 1
  await Story.update(
    { replies: Sequelize.literal(`replies + ${value}`)}, 
    { where: { hash: storyHash } 
  });
}

/**
 * @function updateStoryVotes
 * @name updateStoryVotes
 * @description A function that updates the story votes data: check on votes array in the story model and increment the array of option(index) by 1
 * @param {String} storyHash - The hash of the story
 * @param {Number} option - The index of the option to increment
 * @returns {Promise<void>} - Returns a promise of void data
*/
const updateStoryVotes = async (storyHash, option) => {
  if (!storyHash || !option || typeof option !== 'number') {
    // throw an error
    throw new Error('Story hash and option are required!, option must be a number');
  }
  try {
    // get the story 
    const story = await Story.findOne({
      attributes: ['id', 'votes', 'kind'],
      where: {hash: storyHash}
    });

    if(!story || story.kind !== 'poll') return;

    // update votes
    let voted = story.votes.map((vote, index) => {
      return index === option - 1 ? vote + 1 : vote;
    })

    // Update the story votes by the option: consider postgres index array increment
    await story.update({votes: voted});
  } catch (error) {
    // throw an error
    throw error;
  }
  
}

/**
 * @function updateReplyLikes
 * @name updateReplyLikes
 * @description A function that updates the reply likes data
 * @param {String} replyHash
 * @param {Number} value
 * @returns {Promise<void>} - Returns a promise of void data
*/
const updateReplyLikes = async (replyHash, value) => {
  if (!replyHash || !value || typeof value !== 'number') {
    // throw an error
    throw new Error('Reply hash and value are required!, value must be a number');
  }

  // value can be -1 or 1
  if (value !== -1 && value !== 1) {
    // throw an error
    throw new Error('Value can only be -1 or 1');
  }

  // Update the reply likes by the value: likes + 1 or likes - 1
  await Reply.update(
    { likes: Sequelize.literal(`likes + ${value}`)}, 
    { where: { hash: replyHash } 
  });
}

/**
 * @function updateReplyViews
 * @name updateReplyViews
 * @description A function that updates the reply views data
 * @param {String} replyHash
 * @param {Number} value
 * @returns {Promise<void>} - Returns a promise of void data
*/
const updateReplyViews = async (replyHash, value) => {
  if (!replyHash || !value || typeof value !== 'number') {
    // throw an error
    throw new Error('Reply hash and value are required!, value must be a number');
  }

  // value can be -1 or 1
  if (value !== -1 && value !== 1) {
    // throw an error
    throw new Error('Value can only be -1 or 1');
  }

  // Update the reply views by the value: views + 1 or views - 1
  await Reply.update(
    { views: Sequelize.literal(`views + ${value}`)}, 
    { where: { hash: replyHash } 
  });
}

/**
 * @function updateReplyReplies
 * @name updateReplyReplies
 * @description A function that updates the reply replies data
 * @param {String} replyHash
 * @param {Number} value
 * @returns {Promise<void>} - Returns a promise of void data
*/
const updateReplyReplies = async (replyHash, value) => {
  if (!replyHash || !value || typeof value !== 'number') {
    // throw an error
    throw new Error('Reply hash and value are required!, value must be a number');
  }

  // value can be -1 or 1
  if (value !== -1 && value !== 1) {
    // throw an error
    throw new Error('Value can only be -1 or 1');
  }

  // Update the reply replies by the value: replies + 1 or replies - 1
  await Reply.update(
    { replies: Sequelize.literal(`replies + ${value}`)}, 
    { where: { hash: replyHash } 
  });
}

/**
 * @function viewContent
 * @description Query to add a view to a story or reply or a topic, or user profile
 * @param {String} user - The hash of the user viewing the content || can be null
 * @param {String} target - The hash of the content being viewed
 * @returns {Object} - The view object or null, and the error if any
*/
const viewContent = async (user, target, kind) => {
  try {
    // create a view object
    await View.create({author: user, target, kind});

    // return the view object
    return { viewed: true, error: null };
  }
  catch (error) {
    return { viewed: null, error };
  }
}


// Export the hook functions
module.exports = {
  updateUserFollowers, updateUserFollowing, viewContent,
  updateTopicFollowers, updateTopicSubscribers, updateTopicViews,
  updateStoryLikes, updateStoryViews, updateStoryReplies, updateStoryVotes,
  updateReplyLikes, updateReplyViews, updateReplyReplies
};