// hook fns: functions to udate hooks data in the database
const {
  updateTopicFollowers, updateTopicSubscribers, updateTopicViews,
  updateUserFollowers, updateUserFollowing, updateStoryVotes,
  updateStoryViews, updateStoryLikes, updateStoryReplies,
  updateReplyViews, updateReplyReplies, updateReplyLikes,
} = require('./fns.hook');

// import update tags query 
const { tagStory } = require('../queries').topicQueries;

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
        const {from, to} = data.hashes;
        // call the user updator
        await userUpdator(data.action, from, to, data.value);
        break;
      case 'topic':
        // call the topic updator
        await topicUpdator(data.action, data.hashes.target, data.value);
        break;
      case 'story':
        // call the story updator
        await storyUpdator(data.action, data.hashes.target, data.value);
        break;
      case 'reply':
        // call the reply updator
        await replyUpdator(data.action, data.hashes.target, data.value);
        break;
      case 'tag':
        // call add tag to story
        console.log('The data:', data.hashes.target, data.value);
        const reqData =  {
          hash: data.hashes.target,
          topics: data.value
        }
        const {tagged, error } = await tagStory(reqData);

        if (error) {
          console.log('Error processing the job')
          console.log(error)
        }

        if (!tagged) {
          console.log('Tgging job failed')
        }
        console.log('Tagging job completed')

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
 * @function userUpdator
 * @name userUpdator
 * @description A function that updates the user followers data
 * @param {String} action - The action to perform
 * @param {String} from - The from user hash
 * @param {String} to - The to user hash
 * @param {Number} value - The value to update
*/
const userUpdator = async (action, from, to, value) => {
  if (action === 'connect') {
    // Update the user followers and following
    await updateUserFollowers(to, value);
    await updateUserFollowing(from, value);
  }
}

/**
 * @function topicUpdator
 * @name topicUpdator
 * @description A function that updates the topic followers data
 * @param {String} action - The action to perform
 * @param {String} topicHash - The topic hash
 * @param {Number} value - The value to update
*/
const topicUpdator = async (action, topicHash, value) => {
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
}

/**
 * @function storyUpdator
 * @name storyUpdator
 * @description A function that updates the story views data
 * @param {String} action - The action to perform
 * @param {String} storyHash - The story hash
 * @param {Number} value - The value to update
*/
const storyUpdator = async (action, storyHash, value) => {
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
 * @function replyUpdator
 * @name replyUpdator
 * @description A function that updates the reply views data
 * @param {String} action - The action to perform
 * @param {String} replyHash - The reply hash
 * @param {Number} value - The value to update
*/
const replyUpdator = async (action, replyHash, value) => {
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