const { hashConfig} = require('../../configs');
const {Op} = require("sequelize");
const { sequelize, Topic, Section, Role } = require('../../models').models;
const { RoleBase } = require('../../configs').platformConfig;

// Imports for gen_hash
const { gen_hash } = require("../../wasm");
const  { hash_secret } = require("../../configs").envConfig;

/**
 * @function addTopic
 * @description Query to add a new topic
 * @param {String} userHash - The hash of the user who's creating the topic
 * @param {Object} data - The data of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const addTopic = async (userHash, data) => {
  // Start a new transaction
  const transaction = await sequelize.transaction();

  try {
    // Trying to create a topic to the database
    const topic = await Topic.create({
      author: userHash,
      name: data.name,
      slug: data.slug,
      summery: data.summery,
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
        'authors': ["create", "read", "update", "delete"],
        'sections': ["create", "update", "assign", "remove", "approve", "reject"],
      },
      expired: false
    }, {transaction});

    // Commit the transaction
    await transaction.commit();

    // On success return data
    return { 
      topic: {
        author: topic.author,
        hash: topic.hash,
        name: topic.name,
        slug: topic.slug,
        summery: topic.summery
      },
      error: null
    }
  } catch (error) {
    // Rollback the transaction
    await transaction.rollback();
    return { topic: null, error: error}
  }
}

/**
 * @function checkIfTopicExists
 * @description Query to check if a topic exists
 * @param {String} name - The name of the topic
 * @param {String} slug - The slug of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
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
      return {
        topic: {
          author: topic.author,
          hash: topic.hash,
          name: topic.name,
          slug: topic.slug,
          summery: topic.summery
        }, 
        error: null
      }
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

/**
 * @function editTopic
 * @description Query to edit a topic
 * @param {String} hash - The hash of the topic
 * @param {Object} data - The data of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
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

      return {
        topic: {
          author: topic.author,
          hash: topic.hash,
          name: topic.name,
          slug: topic.slug,
          summery: topic.summery
        }, 
        error: null
      }
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

/**
 * @function findTopic
 * @description Query to find a topic
 * @param {String} hash - The hash of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
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
      return {
        topic: {
          author: topic.author,
          hash: topic.hash,
          name: topic.name,
          slug: topic.slug,
          summery: topic.summery
        }, 
        error: null
      }
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

/**
 * @function removeTopic
 * @description Query to remove a topic
 * @param {String} hash - The hash of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const removeTopic = async (hash) => {
  // Check if a topic exists
  try {
    const result = await Topic.destroy({
      where: {
        hash: hash
      }
    });

    // check if the topic was destroyed
    if (result === 1) {
      return { deleted: true, error: null };
    }
    else {
      return { deleted: false, error: null };
    }
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