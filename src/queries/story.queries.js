// Importing from external modules
const { Op } = require('sequelize');

// Importing from internal modules
const { sequelize, Story, Section, Role } = require('../models').models;
const { hashNumberWithKey } = require('../hash').identityHash;
const { hashConfig, platformConfig } = require('../configs');
const { newStoryData } = require('../data').storyData;


// Check if story exists
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


// Check if story exists using hash
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


// Create a new story
const addStory = async (userId, data) => {

  const storyData = await newStoryData(userId, data);

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    const story = await Story.create(storyData, { transaction });

    story.hash = await hashNumberWithKey(hashConfig.story, story.id);

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

// Edit the story content
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

// Edit the story body
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

// Edit story title
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

// Edit story slug
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

// Edit story topics
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

// Export the the story queries functions
module.exports = {
  checkIfStoryExists, findStoryByHash, addStory, editStoryTopics,
  editStoryContent, editStoryBody, editStoryTitle, editStorySlug
}
