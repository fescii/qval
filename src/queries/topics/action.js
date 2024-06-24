// import models
const { sequelize, Topic, Follow, Subscribe, Tagged } = require('../../models').models;

/**
 * @function followTopic
 * @description Query to follow or unfollow a topic
 * @param {String} user - The hash of the user following the topic
 * @param {String} topic - The hash of the topic to follow
 * @returns {Object} - The follow object or null, and the error if any
*/
const follow = async (user, topic) => {
  try {
    // get or create the follow object
    const [follow, created] = await Follow.findOrCreate({
      where: {
        author: user,
        topic: topic
      },
      defaults: {
        author: user,
        topic: topic
      }
    });

    // if the follow object was created: return follow: true
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

/**
 * @function subscribeTopic
 * @description Query to subscribe or unsubscribe a topic
 * @param {String} user - The hash of the user subscribing to the topic
 * @param {String} topic - The hash of the topic to subscribe
 * @returns {Object} - The subscribe object or null, and the error if any
*/
const subscribe = async (user, topic) => {
  try {
    // get or create the subscribe object
    const [subscribe, created] = await Subscribe.findOrCreate({
      where: {
        author: user,
        topic: topic
      },
      defaults: {
        author: user,
        topic: topic
      }
    });

    // if the subscribe object was created: return subscribe: true
    if (created) {
      return { subscribed: true, error: null };
    }
    else {
      // if the subscribe object was not created: delete it
      await subscribe.destroy();
      return { subscribed: false, error: null };
    }
  }
  catch (error) {
    return { subscribed: null, error };
  }
}

/**
 * @function tagStory
 * @description Query to tag a story with a topic
 * @param {String} story - The hash of the story to tag
 * @param {Array} topicsArray - An array of slugs(strings) of the topics to tag the story with
 * @returns {Object} - The tagged boolean or null, and the error if any
*/
const tagStory = async (story, topicsArray) => {
  try {
    // get all the topics where slug in topics array: return only the hash and slug
    const topics = await Topic.findAll({
      where: {
        slug: {
          [sequelize.Op.in]: topicsArray
        }
      },
      attributes: ['hash', 'slug']
    });

    // if no topics were found, return error
    if (!topics) return { tagged: false, error: new Error("Topics not found!") };

    // create a tagged object for each topic string in the topics array
    const tagged = topics.map(topic => {
      return {
        story: story,
        topic: topic.hash
      }
    });

    // bulk create the tagged objects
    await Tagged.bulkCreate(tagged);

    // return tagged: true if tagged successfully
    return { tagged: true, error: null };
  }
  catch (error) {
    return { tagged: null, error };
  }
}

module.exports = {
  follow, subscribe, tagStory
}