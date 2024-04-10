const { hashConfig} = require("../configs");
const {Op} = require("sequelize");
const { hashNumberWithKey } = require("../utils").hashUtil;
const { sequelize, Topic } = require('../models').models;

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
    
    topic.hash = await hashNumberWithKey(hashConfig.topic, topic.id);
    
    await topic.save({transaction});
    
    await transaction.commit();
    
    // On success return data
    return { data: topic, error: null}
  } catch (err) {
    await transaction.rollback();
    return { data: null, error: err}
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
      // On success return data
      return { data: topic, error: null}
    }
    else {
      // If a topic doesn't exist, returns both null
      return { data: null, error: null}
    }
    
  }
  catch (error) {
    return { data: null, error: error}
  }
}

module.exports = {
  addTopic, checkIfTopicExists
}