const { Activity, Story, Reply, Topic } = require('../models').models;

/**
 * @object kindData
 * @name kindData
 * @description The kind data object
 * @property {String} Story - The story kind
 * @property {String} Reply - The reply kind
 * @property {String} Topic - The topic kind
 * @property {String} User - The user kind
*/
const kindData =  {
  Story: 'story',
  Reply: 'reply',
  Topic: 'topic',
  User: 'user'
}

/**
 * @object actionData
 * @name actionData
 * @description The action data object
 * @property {String} Follow - The follow action
 * @property {String} Like - The like action
 * @property {String} Reply - The reply action
 * @property {String} Create - The create action
 * @property {String} Update - The update action
 * @property {String} Vote - The vote action
 * @property {String} Subscribe - The subscribe action
*/
const actionData = {
  Follow: 'follow',
  Like: 'like',
  Reply: 'reply',
  Create: 'create',
  Update: 'update',
  Vote: 'vote',
  Subscribe: 'subscribe'
}

/**
 * @function activityHook
 * @name activityHook
 * @description A Hook function that updates user: (followers, following) data
 * topic: (followers, views, subscribers) data, story (views, likes) data.
 * @param {Object} data - Data object (user, topic, story)
 * @returns {Promise<void>} - Returns a promise of void data
*/
const activityHook = async data => {
  // check if data is available and contains kind field
  if (!data?.kind || !data?.action || !data?.author || !data?.target || !data?.name || !data?.verb) {
    // Log the error
    console.error('Data is undefined. Adding activity hook process failed');
    return;
  }
  // Try to update the user, topic or story data
  try {
    // check for kind
    if (kind === kindData.User) {
      // create activity directly
      await Activity.create(data);
    } else if (kind === kindData.Story) {
      // switch if the nullable is false
      if (data.nullable === false) {
        // add to to the data object
        data.to = await findStoryAuthor(data.target);

        // create activity directly
        await Activity.create(data);
      } else {
        // create activity directly
        await Activity.create(data);
      }
    } else if (kind === kindData.Reply) {
      // switch if the nullable is false
      if (data.nullable === false) {
        // add to to the data object
        data.to = data.type === 'reply' ? await findReplyAuthor(data.target) : await findStoryAuthor(data.target);

        // create activity directly
        await Activity.create(data);
      } else {
        // create activity directly
        await Activity.create(data);
      }
    }
    else {
      console.log('Kind not found in the options');
      // !TODO: Create a handler for handling this error
    }
  }
  catch (error) {
    console.error('Error initializing activity hook process:', error);
    // !TODO: Create a handler for handling this error
  }
}





/**
 * @function findTopicAuthor
 * @name findTopicAuthor
 * @description A function that finds the author of a topic
 * @param {String} hash - The topic hash
 * @returns {Promise<String>} - Returns a promise of the author hash
*/
const findTopicAuthor = async hash => {
  // Find the topic
  const topic = await Topic.findOne({ attributes: ['author'], where: { hash } });

  // Return the author hash on if topic is found otherwise throw an error
  if (!topic) throw new Error('Topic not found');

  return topic.author;
}

/**
 * @function findStoryAuthor
 * @name findStoryAuthor
 * @description A function that finds the author of a story
 * @param {String} hash - The story hash
 * @returns {Promise<String>} - Returns a promise of the author hash
*/
const findStoryAuthor = async hash => {
  // Find the story
  const story = await Story.findOne({ attributes: ['author'], where: { hash } });

  // Return the author hash on if story is found otherwise throw an error
  if (!story) throw new Error('Story not found');

  return story.author;
}

/**
 * @function findReplyAuthor
 * @name findReplyAuthor
 * @description A function that finds the author of a reply
 * @param {String} hash - The reply hash
 * @returns {Promise<String>} - Returns a promise of the author hash
*/
const findReplyAuthor = async hash => {
  // Find the reply
  const reply = await Reply.findOne({ attributes: ['author'], where: { hash } });

  // Return the author hash on if reply is found otherwise throw an error
  if (!reply) throw new Error('Reply not found');

  return reply.author;
}





