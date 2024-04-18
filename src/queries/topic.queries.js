const { hashConfig} = require('../configs');
const {Op} = require("sequelize");
const { sequelize, Topic, Section, Role } = require('../models').models;
const { RoleBase } = require('../configs').platformConfig;

// Imports for gen_hash
const { gen_hash } = require("../wasm");
const  { hash_secret } = require("../configs").envConfig;

// Query for adding a new topic
const addTopic = async (userId, data) => {
  // Start a new transaction
  const transaction = await sequelize.transaction();

  try {
    // Trying to create a topic to the database
    const topic = await Topic.create({
      author: userId,
      name: data.name,
      slug: data.slug,
      about: data.about
    }, {transaction})

    // Generate a hash for the topic created
    const {
      hash,
      error
    } = await gen_hash(hash_secret, hashConfig.topic, topic.id.toString());

    // If there is an error, throw an error
    if (error) {
      throw new Error(error);
    }

    // Assign the hash to the topic
    topic.hash = hash;

    // Save the topic with the hash
    await topic.save({transaction});

    // Create a section for the topic created
    const section = await Section.create({
      identity: topic.hash,
      target: topic.id,
      name: topic.name,
      description: `This is a section for the topic - ${topic.name}`
    }, {transaction});

    // Create a role for the user who created the topic
    await Role.create({
      section: section.identity,
      user: userId,
      base: RoleBase.Owner,
      name: `This is a role for section - ${topic.name}`,
      privileges: {
        'action': ["create", "read", "update", "delete"],
        'authors': ["create", "read", "update", "delete"]
      },
      expired: false
    }, {transaction});

    // Commit the transaction
    await transaction.commit();

    // On success return data
    return { topic: topic, error: null}
  } catch (error) {
    // Rollback the transaction
    await transaction.rollback();
    return { topic: null, error: error}
  }
}

// Query for checking if a topic exists using the name or slug
const checkIfTopicExists = async (name, slug) => {
  // Check if a topic exists
  try {
    const topic = await Topic.findOne({
      where: {
        [Op.or]: [
          {name: name},
          {slug: slug}
        ]
      }
    });

    // If a topic exists, return the topic
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

// Query for editing an existing topic
const editTopic = async (hash, data) => {
  // Start a new transaction
  const transaction = await sequelize.transaction();

  try {
    const topic = await Topic.findOne({
      where: {
        hash: hash
      }
    });

    // If a topic exists, update the topic
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

// Query for finding a topic using the hash
const findTopic = async (hash) => {
  // Check if a topic exists
  try {
    const topic = await Topic.findOne({
      where: {
        hash: hash
      }
    });

    // If a topic exists, return the topic
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

// Query for removing a topic using the hash
const removeTopic = async (hash) => {
  // Check if a topic exists
  try {
    await Topic.destroy({
      where: {
        hash: hash
      }
    });

    // If operation is successful, return deleted true
    return { deleted: true, error: null}
  }
  catch (error) {
    return { deleted: false, error: error}
  }
}

// Export the query functions
module.exports = {
  addTopic, checkIfTopicExists, editTopic,
  findTopic, removeTopic
}