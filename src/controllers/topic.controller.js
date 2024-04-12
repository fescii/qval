// Importing within the app
const { validateTopicData } = require('../validators').topicValidator;
const { Privileges } = require('../configs').platformConfig;
const { checkAuthority } = require('../utils').roleUtil;
const { addTopic, editTopic, removeTopic } = require('../queries').topicQueries;

// Controller for creating a topic
const createTopic = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.topic_data || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }
  
  // Get validated payload and user data from request object
  const data = req.topic_data;
  const userId = req.user.id;
  
  const {
    topic,
    error
  } = await addTopic(userId, data);
  
  // Passing the error to error middleware
  if (error) {
    return next(error);
  }
  
  return res.status(201).send({
    success: true,
    topic: {
      author: topic.author,
      name: topic.name,
      slug: topic.slug,
      hash: topic.hash,
      about: topic.about
    },
    message: "Topic was created successfully!"
  });
};

// Controller updating creating a topic
const updateTopic = async (req, res, next) => {
  // Check if the user or payload is available
  const { topicHash } = req.params;
  
  if (!req.body || !topicHash || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }
  
  // get user id
  const userId = req.user.id;
  
  const topicData = await validateTopicData(req.body);
  
  // Handling data validation error
  if (topicData.error) {
    return res.status(400).send({
      success: false,
      message: topicData.error.message
    });
  }
  
  // Create access data - (For authorizing user)
  const access = {
    section: topicHash,
    privilege: Privileges.Update,
    user: userId,
    key: 'action'
  }
  
  const isAuthorised = await checkAuthority(access);
  
  if (isAuthorised){
    const {
      topic,
      error
    } = await editTopic(topicHash, topicData.data);
    
    // Passing the error to error middleware
    if (error) {
      return next(error);
    }
    
    // Handling when the topic is not found
    if (!topic) {
      return res.status(404).send({
        success: false,
        message: "The topic you're trying to update was not found!"
      });
    }
    
    return res.status(200).send({
      success: true,
      topic: {
        author: topic.author,
        name: topic.name,
        slug: topic.slug,
        hash: topic.hash,
        about: topic.about
      },
      message: "Topic was updated successfully!"
    });
  }
  else {
    return res.status(401).send({
      success: false,
      message: "You are not authorize to perform this action!"
    });
  }
};

// Controller updating creating a topic
const deleteTopic = async (req, res, next) => {
  // Check if the user or payload is available
  const { topicHash } = req.params;
  
  // get user id
  const userId = req.user.id;
  
  // Create access data - (For authorizing user)
  const access = {
    section: topicHash,
    privilege: Privileges.Delete,
    user: userId,
    key: 'action'
  }
  
  const isAuthorised = await checkAuthority(access);
  
  if (isAuthorised){
    const {
      deleted,
      error
    } = await removeTopic(topicHash);
    
    // Passing the error to error middleware
    if (error) {
      return next(error);
    }
    
    if(!deleted){
      const error = new Error('Something went insanely wrong!');
      return next(error)
    }
    
    // Handling when the topic was deleted
    return res.status(200).send({
      success: true,
      message: `Topic - ${topicHash} was deleted successfully!`
    });
  }
  else {
    return res.status(401).send({
      success: false,
      message: "You are not authorize to perform this action!"
    });
  }
};

module.exports = {
  createTopic, updateTopic, deleteTopic
}