const { Activity } = require('../models').models;

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
  // Log the process initialization
  console.log('Action hook process initialized');

  // Try to update the user, topic or story data
  try {

    // check if to field is available
    if (!data?.to) {
      // fetch the target item author hash
    
    }
    
    // Create the activity
    const activity = await Activity.create(data);


    // Log the process completion
    console.log('Action hook process completed');
  }
  catch (error) {
    console.error('Error initializing activity hook process:', error);

    // !TODO: Create a handler for handling this error
  }
}





