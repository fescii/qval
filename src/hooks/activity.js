const { Activity, Story, Reply, Topic, User } = require('../models').models;

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
    const kind = data.kind.toLowerCase();
    // check for kind
    if (kind === kindData.User) {
      // find user information
      const content = await findUserInfo(data.author);

      // add author and content to the data object
      data.content = content;

      // create activity directly
      await Activity.create(data);
    } else if (kind === kindData.Story) {
      const { author, content } = await findStoryInfo(data.target);
        
      // add author and content to the data object
      data.to = author;
      data.content = content;

      // create activity directly
      await Activity.create(data);
    } else if (kind === kindData.Reply) {
      const { author, content } = await findReplyInfo(data.target);

      // add author and content to the data object
      data.to = author;
      data.content = content;

      // create activity directly
      await Activity.create(data);
    } else if(kind === kindData.Topic) {
      // create activity directly
      const { author, content } = await findTopicInfo(data.target);

      // add author and content to the data object
      data.to = author;
      data.content = content;

      // create activity directly
      await Activity.create(data);
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
 * @function findStoryInfo
 * @name findStoryInfo
 * @description A function that finds the author of a story
 * @param {String} hash - The story hash
 * @returns {Promise<Object>} - Returns a promise of the author hash and content
*/
const findStoryInfo = async hash => {
  // Find the story
  const story = await Story.findOne({ attributes: ['author', 'content', 'title'], where: { hash } });

  // Return the author hash on if story is found otherwise throw an error
  if (!story) throw new Error('Story not found');

  if(!story.title) {
    story.title = summarize(story.content);
  }

  return { author: story.author, content: story.title };
}

/**
 * @function findReplyInfo
 * @name findReplyInfo
 * @description A function that finds the author of a reply
 * @param {String} hash - The reply hash
 * @returns {Promise<Object>} - Returns a promise of the author hash and content
*/
const findReplyInfo = async hash => {
  // Find the reply
  const reply = await Reply.findOne({ attributes: ['author', 'content'], where: { hash } });

  // Return the author hash on if reply is found otherwise throw an error
  if (!reply) throw new Error('Reply not found');

  const content = summarize(reply.content);

  return { author: reply.author, content };
}

/**
 * @function findTopicInfo
 * @name findTopicInfo
 * @description A function that finds the author of a topic
 * @param {String} hash - The topic hash
 * @returns {Promise<Object>} - Returns a promise of the author hash and content
*/
const findTopicInfo = async hash => {
  // Find the topic
  const topic = await Topic.findOne({ attributes: ['author', 'name'], where: { hash } });

  // Return the author hash on if topic is found otherwise throw an error
  if (!topic) throw new Error('Topic not found');

  return {author: topic.author, content: topic.name};
}

/**
 * @function findUserInfo
 * @name findUserInfo
 * @description A function that finds the user information
 * @param {String} hash - The user hash
 * @returns {Promise<Object>} - Returns a promise of the user hash and content
*/

const findUserInfo = async hash => {
  // Find the user
  const user = await User.findOne({ attributes: ['hash', 'name'], where: { hash } });

  // Return the user hash on if user is found otherwise throw an error
  if (!user) throw new Error('User not found');

  return `${user.name} - @${user.hash}`;
}


/**
 * @function summarize
 * @name summarize
 * @description A function that summarizes a text
 * @param {String} text - The text to summarize
 * @returns {String} - Returns a summarized text truncated to 150 characters
*/
const summarize = text => {
  // Check if the text is encoded (contains &lt; or &gt;)
  if (text.includes('&lt;') || text.includes('&gt;')) {
    // remove them from the text
    str = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  } else {
    // Directly remove all HTML tags
    str = text.replace(/<[^>]*>/g, '');
  }

  return str.trim().substring(0, 150) + '...';
}

// Export the activity hook
module.exports = activityHook;