// Importing the required modules, fns, configs, and utils...
const { hashConfig} = require('../../configs');
const { sequelize, Sequelize, Section, Story, Role, User } = require('../../models').models;
const { RoleBase } = require('../../configs').platformConfig;
const Op = Sequelize.Op;

// Imports for gen_hash
const { gen_hash } = require("../../wasm");
const  { hash_secret } = require("../../configs").envConfig;


/**
 * @function addStory
 * @description a function that adds a new story to the database
 * @param {Object} user - The user object(id, email, hash)
 * @param {Object} data - The story data object
 * @returns {Object} data - The added story object and error if any
*/
const addStory = async (user, data) => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // add author to the data object
    data.author = user.hash;

    // Create the story
    const story = await Story.create(data, { transaction: t });

    // Generate a hash for the story created
    const {
      hash,
      error
    } = await gen_hash(hash_secret, hashConfig.story, story.id.toString());

    // Check if there was an error generating the hash
    if (error) {
      // Throw the error
      throw error;
    }

    // Update the story with the hash
    await story.update({ hash }, { transaction: t });

    // Create a section for the story created
    const section = await Section.create({
      identity: story.hash,
      target: story.id,
      name: `Story - ${story.hash}`,
      description: `This is a section for the story - ${story.hash}`
    }, {transaction: t});

    // Create a role for the user who created the story
    await Role.create({
      section: section.identity,
      user: user.id,
      base: RoleBase.Owner,
      name: `This is a role for section - ${section.name}`,
      privileges: {
        'action': ["create", "read", "update", "delete"],
        'authors': ["create", "read", "update", "delete"],
        'sections': ["create", "update", "assign", "remove", "approve", "reject"],
        'replies': ["create", "read", "update", "delete"],
      },
      expired: false
    }, {transaction: t});

    // Commit the transaction
    await t.commit();

    // return the story
    return { 
      story: {
        kind: story.kind,
        author: story.author,
        hash: story.hash,
        title: story.title,
        content: story.content,
        slug: story.slug,
        topics: story.topics,
        poll: story.poll,
        votes: story.votes,
        views: story.views,
        replies: story.replies,
        likes: story.likes,
      }, 
      error: null 
    };
  }
  catch (error) {
    // Rollback the transaction
    await t.rollback();

    // return the error
    return { story: null, error };
  }
}

/**
 * @function checkIfStoryExists
 * @description a function that checks if a story exists in the database: using slug
 * @param {String} slug - The story slug
 * @returns {Object} data - The story object and error if any
*/
const checkIfStoryExists = async slug => {
  try {
    // Find the story
    const story = await Story.findOne({ where: { slug } });

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    // return the story
    return { 
      story: {
        kind: story.kind,
        author: story.author,
        hash: story.hash,
        title: story.title,
        content: story.content,
        slug: story.slug,
        topics: story.topics,
        poll: story.poll,
        votes: story.votes,
        views: story.views,
        replies: story.replies,
        likes: story.likes,
      }, 
      error: null 
    };
  }
  catch (error) {
    // return the error
    return { story: null, error };
  }
}

/**
 * @function findStory
 * @description a function that finds a story in the database: using hash
 * @param {String} hash - The story hash
 * @returns {Object} data - The story object and error if any
*/
const findStory = async hash => {
  try {
    // Find the story
    const story = await Story.findOne({ where: { hash } });

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    // return the story
    return { 
      story: {
        kind: story.kind,
        author: story.author,
        hash: story.hash,
        title: story.title,
        content: story.content,
        slug: story.slug,
        topics: story.topics,
        poll: story.poll,
        votes: story.votes,
        views: story.views,
        replies: story.replies,
        likes: story.likes,
      }, 
      error: null 
    };

  }
  catch (error) {
    // return the error
    return { story: null, error };
  }
}

/**
 * @function updateStory
 * @description a function that updates a story in the database
 * @param {Object} data - The story data object
 * @returns {Object} data - The updated story object and error if any
*/
const updateStory = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the story
    const story = await Story.findOne({ where: { hash: data.hash } });

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    // Update the story with the new data: content
    await story.update({content: data.content}, { transaction: t });

    // Commit the transaction
    await t.commit();

    // return only the updated fields
    return { 
      story: {
        content: story.content
      },
      error: null
    }
  }
  catch (error) {
    // Rollback the transaction
    await t.rollback();

    // return the error
    return { story: null, error };
  }
}
