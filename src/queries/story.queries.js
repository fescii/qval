// Importing from external modules
const { Op } = require('sequelize');

// Importing from internal modules
const { sequelize, Story, Section, Role } = require('../models').models;
const { hashConfig, platformConfig } = require('../configs');
const { newStoryData } = require('../data').storyData;

// Imports for gen_hash
const { hash_secret } = require("../configs").envConfig;
const { gen_hash } = require("../wasm");


/**
 * @function checkIfStoryExists
 * @description Query function to check if a story exists
 * @param {String} slug - The slug of the story
 * @returns {Object} - The story object or null, and the error if any
*/
const checkIfStoryExists = async (slug) => {
  try {
    const story = await Story.findOne({
      where: {
        slug: slug
      }
    });

    if (story) {
      return {story: story, error: null};
    }
    else {
      return {story: null, error: null};
    }
  }
  catch (error) {
    console.log(error);
    return {story: null, error: error};
  }
}


/**
 * @function findStoryByHash
 * @description Query function to find a story by hash
 * @param {String} hash - The hash of the story
 * @returns {Object} - The story object or null, and the error if any
*/
const findStoryByHash = async (hash) => {
  try {
    const story = await Story.findOne({
      where: { hash: hash }
    });

    // If story is returned by the query then return the story
    if (story) {
      return { story: story, error: null };
    }
    // Else return both null
    else {
      return { story: null, error: null };
    }
  }
  catch (error) {
    console.log(error);
    return { story: null, error: error };
  }
}


/**
 * @function addStory
 * @description Query function to add a story
 * @param {String} userId - The id of the user adding the story
 * @param {Object} data - The data of the story to be added
 * @returns {Object} - The story object or null, and the error if any
*/
const addStory = async (userId, data) => {

  const storyData = await newStoryData(userId, data);

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    const story = await Story.create(storyData, { transaction });

    // story.hash = await hashNumberWithKey(hashConfig.story, story.id);
    // Generate the story hash using story id
    const {
      hash,
      error
    } = await gen_hash(hash_secret, hashConfig.story, story.id.toString());

    // If error is not equal to undefined throw an error
    if (error){
      throw new Error(error);
    }

    // Else set the hash to the story hash
    story.hash = hash;

    await story.save({ transaction });

    // Create a section for the story created
    const section = await Section.create({
      identity: story.hash,
      target: story.id,
      name: story.hash,
      description: `This is a section for the story - ${story.title}`
    }, { transaction });

    // Create an author role for the section created
    await Role.create({
      section: section.identity,
      user: userId,
      base: platformConfig.RoleBase.Admin,
      name: `This is a role for section - ${story.title}`,
      privileges: {
        'action': ["create", "read", "update", "delete"],
        'authors': ["create", "read", "update", "delete"],
        'opinions': ["create", "read", "update", "delete"],
        'replies': ["create", "read", "update", "delete"]
      },
      expired: false
    }, { transaction });


    await transaction.commit();

    // On successfully creating the story return the story
    return { story: story, error: null };
  }

  catch (error) {
    // console.log(error);
    await transaction.rollback();
    return { story: null, error: error };
  }
}

/**
 * @function editStoryContent
 * @description Query function to edit the story content
 * @param {String} hash - The hash of the story
 * @param {Object} data - The data to be updated
 * @returns {Object} - The story object or null, and the error if any
*/
const editStoryContent = async (hash, data) => {
  const transaction = await sequelize.transaction();

  try {
    const story = await Story.findOne({
      where: { hash: hash }
    },{ transaction })

    // Check of the story exists
    if (story) {

      // console.log(story.topics);
      story.content = data.content;

      await story.save({ transaction });

      await transaction.commit();

      // console.log(story.topics);

      return { story: story, error: null };
    }
    // If story does not exist return both null
    else {
      return { story: null, error: null };
    }
  }
  catch (error) {
    // console.log(error);
    await transaction.rollback();
    return { story: null, error: error };
  }
}

/**
 * @function editStoryBody
 * @description Query function to edit the story body
 * @param {String} hash - The hash of the story
 * @param {Object} data - The data to be updated
 * @returns {Object} - The story object or null, and the error if any
*/
const editStoryBody = async (hash, data) => {

  // create a new transaction
  const transaction = await sequelize.transaction();

  // Try to update the story body
  try {

    // Get the story by hash from the database
    const story = await Story.findOne({
      where: { hash: hash }
    }, { transaction })

    // Check of the story exists
    if (story) {
      // Update the story body
      story.body = data.body;
      await story.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      return { story: story, error: null };
    }
    // If story does not exist return both null
    else {
      return { story: null, error: null };
    }
  }
  catch (error) {
    // Rollback the transaction
    await transaction.rollback();

    return { story: null, error: error };
  }
}

/**
 * @function editStoryTitle
 * @description Query function to edit the story title
 * @param {String} hash - The hash of the story
 * @param {Object} data - The data to be updated
 * @returns {Object} - The story object or null, and the error if any
*/
const editStoryTitle = async (hash, data) => {
  // create a new transaction
  const transaction = await sequelize.transaction();

  // Try to update the story title
  try {

    // Get the story by hash from the database
    const story = await Story.findOne({
      where: { hash: hash }
    }, { transaction })

    // Check of the story exists
    if (story) {
      // Update the story title
      story.title = data.title;
      await story.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      return { story: story, error: null };
    }
    // If story does not exist return both null
    else {
      return { story: null, error: null };
    }
  }
  catch (error) {
    // Rollback the transaction
    await transaction.rollback();

    return { story: null, error: error };
  }
}

/**
 * @function editStorySlug
 * @description Query function to edit the story slug
 * @param {String} hash - The hash of the story
 * @param {Object} data - The data to be updated
 * @returns {Object} - The story object or null, and the error if any
*/
const editStorySlug = async (hash, data) => {
  // create a new transaction
  const transaction = await sequelize.transaction();

  // Try to update the story slug
  try {

    // Check if the story with similar slug already exists
    const storyExists = await Story.findOne({
      where: {
        slug: data.slug,
        [Op.not]: { hash: hash }
      }
    }, { transaction });

    console.log(data.slug);

    console.log(storyExists);

    if (storyExists) {
      return { story: storyExists, exists: true, error: null };
    }

    // Get the story by hash from the database
    const story = await Story.findOne({
      where: { hash: hash }
    }, { transaction });


    // Check of the story exists
    if (story) {
      // Update the story slug
      story.slug = data.slug;
      await story.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      return { story: story, exists: false, error: null };
    }
    // If story does not exist return both null
    else {
      return { story: null, exists: false, error: null };
    }
  }
  catch (error) {
    // Rollback the transaction
    await transaction.rollback();

    return { story: null, exists: false, error: error };
  }
}

/**
 * @function editStoryTopics
 * @description Query function to edit the story topics
 * @param {String} hash - The hash of the story
 * @param {Object} data - The data to be updated
 * @returns {Object} - The story object or null, and the error if any
*/
const editStoryTopics = async (hash, data) => {
  // create a new transaction
  const transaction = await sequelize.transaction();

  // Try to update the story topics
  try {
    const story = await Story.findOne({
      where: { hash: hash }
    }, { transaction })

    // Check of the story exists
    if (story) {
      // Update the story topics
      story.topics = data.topics;
      await story.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      return { story: story, error: null };
    }
    // If story does not exist return both null
    else {
      return { story: null, error: null };
    }
  }
  catch (error) {
    // Rollback the transaction
    await transaction.rollback();

    return { story: null, error: error };
  }
}


/**
 * @function removeStory
 * @description Query function to remove a story
 * @param {String} hash - The hash of the story
 * @returns {Object} - The story object or null, and the error if any
*/
const removeStory = async (hash) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the story by hash
    const story = await Story.findOne({
      where: { hash: hash }
    }, { transaction });

    // If story is found then delete the story
    if (story) {
      await story.destroy({ transaction });
      await transaction.commit();
      return { story: story, error: null };
    }
    // If story is not found then return both null
    else {
      return { story: null, error: null };
    }
  }
  catch (error) {
    // Rollback the transaction
    await transaction.rollback();
    return { story: null, error: error };
  }
}

// Export the the story queries functions
module.exports = {
  checkIfStoryExists, findStoryByHash, addStory,
  editStoryTopics, editStoryContent, editStoryBody,
  editStoryTitle, editStorySlug, removeStory
}