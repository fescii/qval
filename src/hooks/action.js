// hook fns: functions to update hooks data in the database
const {
  updateUserFollowers, updateUserFollowing, updateUserReplies, updateUserStories,
  updateTopicFollowers, updateTopicSubscribers, updateTopicViews, updateTopicStories,
  updateStoryVotes, updateStoryViews, updateStoryLikes, updateStoryReplies, 
  updateReplyViews, updateReplyReplies, updateReplyLikes, viewContent, updateUserViews
} = require('./fns');

// import update tags query 
const { tagStory } = require('../queries').topicQueries;

/**
 * @function actionHook
 * @name actionHook
 * @description A Hook function that updates user: (followers, following) data
 * topic: (followers, views, subscribers) data, story (views, likes) data.
 * @param {Object} data - Data object (user, topic, story)
 * @returns {Promise<void>} - Returns a promise of void data
*/
const actionHook = async data => {
  // check if data is available and contains kind field
  if (!data?.kind || !data?.action) {
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
        // call the user updater
        await userUpdater(data.action, data.hashes, data.value);
      break;
      case 'topic':
        // call the topic updater
        await topicUpdater(data.action, data.hashes.target, data.value);
      break;
      case 'story':
        // call the story updater
        await storyUpdater(data.action, data.hashes.target, data.value);
      break;
      case 'reply':
        // call the reply updater
        await replyUpdater(data.action, data.hashes.target, data.value);
      break;
      case 'tag':
        tagStory({hash: data.hashes.target, topics: data.value})
        .then((tagged, error) => {
          if (error) {
            console.log('Error processing the job')
            console.log(error)
          } else if (!tagged) {
          console.log('Tagging job failed')
          }
        });
      break;
      case 'view':
        viewContent(data.user, data.hashes.target, data.action)
        .then((viewed, error) => {
          if (error) {
            console.log('Error processing the job')
            console.log(error)
          } else if (!viewed) {
          console.log('Viewing job failed')
          }
        });
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

/**
 * @function userUpdater
 * @name userUpdater
 * @description A function that updates the user followers data
 * @param {String} action - The action to perform
 * @param {Object} hashes - The user hashes
 * @param {Number} value - The value to update
*/
const userUpdater = async (action, hashes, value) => {
  if (action === 'connect') {
    // Update the user followers and following
    await updateUserFollowers(hashes.to, value);
    await updateUserFollowing(hashes.from, value);
  }
  else if (action === 'reply') {
    // Update the user replies
    await updateUserReplies(hashes.target, value);
  }
  else if (action === 'story') {
    // Update the user stories
    await updateUserStories(hashes.target, value);
  }
  else if (action === 'view') {
    // Update the user views
    await updateUserViews(hashes.target, value);
  }
}

/**
 * @function topicUpdater
 * @name topicUpdater
 * @description A function that updates the topic followers data
 * @param {String} action - The action to perform
 * @param {String} topicHash - The topic hash
 * @param {Number} value - The value to update
*/
const topicUpdater = async (action, topicHash, value) => {
  if (action === 'subscribe') {
    // Update the topic subscribers
    await updateTopicSubscribers(topicHash, value);
  }
  else if (action === 'follow') {
    // Update the topic followers
    await updateTopicFollowers(topicHash, value);
  }
  else if (action === 'view') {
    // Update the topic views
    await updateTopicViews(topicHash, value);
  }
  else if (action === 'story') {
    // Update the topic stories
    await updateTopicStories(topicHash, value);
  }
}

/**
 * @function storyUpdater
 * @name storyUpdater
 * @description A function that updates the story views data
 * @param {String} action - The action to perform
 * @param {String} storyHash - The story hash
 * @param {Number} value - The value to update
*/
const storyUpdater = async (action, storyHash, value) => {
  if (action === 'view') {
    // Update the story views
    await updateStoryViews(storyHash, value);
  }
  else if (action === 'like') {
    // Update the story likes
    await updateStoryLikes(storyHash, value);
  }
  else if (action === 'reply') {
    // Update the story replies
    await updateStoryReplies(storyHash, value);
  }
  else if (action === 'vote') {
    // Update the story votes
    await updateStoryVotes(storyHash, value);
  }
}

/**
 * @function replyUpdater
 * @name replyUpdater
 * @description A function that updates the reply views data
 * @param {String} action - The action to perform
 * @param {String} replyHash - The reply hash
 * @param {Number} value - The value to update
*/
const replyUpdater = async (action, replyHash, value) => {
  if (action === 'view') {
    // Update the reply views
    await updateReplyViews(replyHash, value);
  }
  else if (action === 'like') {
    // Update the reply likes
    await updateReplyLikes(replyHash, value);
  }
  else if (action === 'reply') {
    // Update the reply replies
    await updateReplyReplies(replyHash, value);
  }
}


// Export all hooks
module.exports = {
  actionHook
}