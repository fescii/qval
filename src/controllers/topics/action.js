// import foolow and subscribe queries
const { follow, subscribe } = require('../../queries/topics');


/**
 * @function followTopic
 * @description Controller to follow or unfollow a topic
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const followTopic = async (req, res, next) => {
  // check if payload is valid
  if (!req.user || !req.params) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // get the topic hash
  let topic = req.params.hash;

  // convert hash to uppercase
  topic = topic.toUpperCase();

  // follow or unfollow the topic
  const { followed, error } = await follow(req.user.hash, topic);

  // if there is an error, pass it to the error middleware
  if (error) {
    return next(error);
  }

  // return success message
  return res.status(200).send({
    success: true,
    followed: followed,
    message: followed ? 'You are now following this topic!' : 'You have unfollowed this topic!'
  });
}

/**
 * @function subscribeTopic
 * @description Controller to subscribe or unsubscribe a topic
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const subscribeTopic = async (req, res, next) => {
  // check if payload is valid
  if (!req.user || !req.params) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // get the topic hash
  let topic = req.params.hash;

  // convert hash to uppercase
  topic = topic.toUpperCase();

  // subscribe or unsubscribe the topic
  const { subscribed, error } = await subscribe(req.user.hash, topic);

  // if there is an error, pass it to the error middleware
  if (error) {
    return next(error);
  }

  // return success message
  return res.status(200).send({
    success: true,
    subscribed: subscribed,
    message: subscribed ? 'You are now subscribed to this topic!' : 'You have unsubscribed from this topic!'
  });
}

// Export all topic actions
module.exports = {
  followTopic,
  subscribeTopic
};