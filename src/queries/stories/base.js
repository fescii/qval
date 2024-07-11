// Importing the required modules, fns, configs, and utils...
const { hashConfig} = require('../../configs');
const { sequelize, Section, Story, Role} = require('../../models').models;
const { RoleBase } = require('../../configs').platformConfig;
const { actionQueue } = require('../../bull');

// Imports for gen_hash
const { gen_hash } = require("../../wasm");
const  { hash_secret } = require("../../configs").envConfig;


const { 
  findStoryWhenLoggedIn, findStoryWhenLoggedOut, findReplyWhenLoggedIn, findReplyWhenLoggedOut
} = require('./helper');


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

    // Add a job to the queue
    await addJob(story);

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

// add a job to the queue
const addJob = async story => {
  if (story.topics.length > 0) {
    // add the job to the queue: to tagg the story to the topic
    await actionQueue.add('actionJob', {
      kind: 'tag',
      hashes: {
        target: story.hash,
      },
      action: 'topic',
      value: story.topics,
    }, { attempts: 3, backoff: 1000, removeOnComplete: true });
  
    story.topics.map(async topic => {
      // add the job to the queue : to update the topic stories count
      await actionQueue.add('actionJob', {
        kind: 'topic',
        hashes: {
          target: topic,
        },
        action: 'story',
        value: 1,
      }, { attempts: 3, backoff: 1000, removeOnComplete: true });
    });
  }

  // construct the job payload: for queueing and add the job to the queue(for the user)
  await actionQueue.add('actionJob', {
    kind: 'user',
    hashes: {
      target: story.author,
    },
    action: 'story',
    value: 1,
  },{ attempts: 3, backoff: 1000, removeOnComplete: true });
};


/**
 * @function publishStory
 * @description a function that publishes a story: basically changes the published status to true
 * @param {Object} data - The data containing the story hash and author
 * @returns {Object} data - The published story object and error if any
*/
const publishStory = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the story
    const story = await Story.findOne({ where: { hash: data.hash, author: data.author}});

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    // Update the story with the new data: published
    await story.update({published: true}, { transaction: t });

    // Commit the transaction
    await t.commit();

    // return only the updated fields
    return { 
      story: {
        published: story.published
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
    const story = await Story.findOne({ where: { hash, publised: true } });

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
 * @function editStory
 * @description a function that updates a story in the database
 * @param {Object} data - The story data object
 * @returns {Object} data - The updated story object and error if any
*/
const editStory = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the story
    const story = await Story.findOne({ where: { hash: data.hash, author: data.author}});

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

/**
 * @function editTitle
 * @description a function that updates a story title in the database
 * @param {Object} data - The story data object
 * @returns {Object} data - The updated story object and error if any
*/
const editTitle = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the story
    const story = await Story.findOne({ where: { hash: data.hash, author: data.author}});

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    // Update the story with the new data: title
    await story.update({title: data.title}, { transaction: t });

    // Commit the transaction
    await t.commit();

    // return only the updated fields
    return { 
      story: {
        title: story.title
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

/**
 * @function editSlug
 * @description a function that updates a story slug in the database
 * @param {Object} data - The story data object
 * @returns {Object} data - The updated story object and error if any
*/
const editSlug = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the story
    const story = await Story.findOne({ where: { hash: data.hash, author: data.author}});

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    // Update the story with the new data: slug
    await story.update({slug: data.slug}, { transaction: t });

    // Commit the transaction
    await t.commit();

    // return only the updated fields
    return { 
      story: {
        slug: story.slug
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

/**
 * function findStoryBySlugOrHash
 * @description Query to find a topic by slug or hash
 * @param {String} query - The query of the topic
 * @param {String} user - The user hash
 * @returns {Object} - The topic object or null, and the error if any
*/
const findStoryBySlugOrHash = async (query, user) => {
  try {
    // check if user is logged in
    if (user !== null) {
      return await findStoryWhenLoggedIn(query, user);
    }
    else {
      return await findStoryWhenLoggedOut(query);
    }
  }
  catch (error) {
    return { topic: null, error: error}
  }
}

/**
 * @function findReplyByHash
 * @description Query to find a reply by hash
 * @param {String} hash - The hash of the reply
 * @param {String} user - The hash of the user
 * @returns {Object} - The reply object or null, and the error if any
*/
const findReplyByHash = async (hash, user) => {
  try {
    // check if user is logged in
    if (user !== null) {
      return await findReplyWhenLoggedIn(hash, user);
    }
    else {
      return await findReplyWhenLoggedOut(hash);
    }
  }
  catch (error) {
    return { reply: null, error };
  }
}

/**
 * @function removeStory
 * @description a function that removes a story from the database
 * @param {String} hash - The story hash
 * @returns {Object} data - The removed true or false and error if any
*/
const removeStory = async hash => {
  try {
    // Destroy the story
    const result = await Story.destroy({ where: { hash } });

    // Check if the story was removed
    if (result === 1) {
      return { deleted: true, error: null };
    }
    else {
      return { deleted: false, error: null };
    }
  }
  catch (error) {
    return { deleted: null, error };
  }
}

// Export the module
module.exports = {
  addStory, checkIfStoryExists,
  findStory, editStory, editSlug,
  findStoryBySlugOrHash, editTitle, findReplyByHash,
  removeStory, publishStory
};