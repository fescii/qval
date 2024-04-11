const { hashConfig} = require('../configs');
const {Op} = require("sequelize");
const { sequelize, Topic } = require('../models').models;
const { hashUtil } = require("../utils");

const addTopic = async (userId, data) => {
  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    // Trying to create a topic to the database
    const topic = await Topic.create({
      author: userId,
      name: data.name,
      slug: data.slug,
      about: data.about
    }, {transaction})
    
    topic.hash = await hashUtil.hashNumberWithKey(hashConfig.topic, topic.id);
    
    await topic.save({transaction});
    
    await transaction.commit();
    
    // On success return data
    return { topic: topic, error: null}
  } catch (error) {
    await transaction.rollback();
    return { topic: null, error: error}
  }
}

const checkIfTopicExists = async (name, slug) => {
  
  try {
    const topic = await Topic.findOne({
      where: {
        [Op.or]: [
          {name: name},
          {slug: slug}
        ]
      }
    });
    
    if (topic) {
      // console.log(topic)
      // On success return data
      return { topic: topic, error: null}
    }
    else {
      // If a topic doesn't exist, returns both null
      return { topic: null, error: null}
    }
    
  }
  catch (error) {
    return { topic: null, error: error}
  }
}

const editTopic = async (hash, data) => {
  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    const topic = await Topic.findOne({
      where: {
        hash: hash
      }
    });
    
    if (topic) {
      // console.log(topic)
      topic.name = data.name;
      topic.slug = data.slug;
      topic.about = data.about;
      
      await topic.save({transaction});
      
      await transaction.commit();
      
      return { topic: topic, error: null}
    }
    else {
      // If a topic doesn't exist, returns both null
      return { topic: null, error: null}
    }
  }
  catch (error) {
    await transaction.rollback();
    return { topic: null, error: error}
  }
}

const findTopic = async (hash) => {
  
  try {
    const topic = await Topic.findOne({
      where: {
        hash: hash
      }
    });
    
    if (topic) {
      return { topic: topic, error: null}
    }
    else {
      // If a topic doesn't exist, returns both null
      return { topic: null, error: null}
    }
  }
  catch (error) {
    return { topic: null, error: error}
  }
}

module.exports = {
  addTopic, checkIfTopicExists, editTopic,
  findTopic
}