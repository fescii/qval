// Importing within the app
const { Topic } = require("../models").models;
const { hashConfig } = require('../configs');
const { sequelize } = require("../models");
const { hashUtil} = require("../utils");

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
  
  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    // Trying to create new user to the database
    const topic = await Topic.create({
      author: userId,
      name: data.name,
      slug: data.slug,
      about: data.about
    }, { transaction })
    
    topic.hash = await hashUtil.hashNumberWithKey(hashConfig.topic, topic.id);
    
    await topic.save({ transaction });
    
    await transaction.commit();
    
    // On success return response to the user
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
  }
  catch (err) {
    await transaction.rollback();
    await next(err);
  }
};
module.exports = {
  createTopic
}