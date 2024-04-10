// Importing within the app
const { addTopic } = require('../queries').topicQueries;

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
  
  return res.status(200).send({
    success: true,
    topic: {
      id: topic.id,
      author: topic.author,
      name: topic.name,
      slug: topic.slug,
      hash: topic.hash,
      about: topic.about
    },
    message: "Topic was added successfully!"
  });
};
module.exports = {
  createTopic
}