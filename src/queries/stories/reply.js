// Import all necessary modules, fns, and configs...
const { hashConfig } = require('../../configs');
const { sequelize, Sequelize, Reply } = require('../../models').models;


const { actionQueue } = require('../../bull');

// Imports for gen_hash
const { gen_hash } = require("../../wasm");
const  { hash_secret } = require("../../configs").envConfig;


/**
 * @function addReply
 * @description a function that adds a new reply to the database
 * @param {Object} data - The reply data object
 * @returns {Object} data - The added reply object and error if any
*/
const addReply = async data => {
  // start a transaction
  const t = await sequelize.transaction();

  try {
    // create a new reply
    const reply = await Reply.create(data, {transaction: t});

    // Generate a hash for the story created
    const {
      hash,
      error
    } = await gen_hash(hash_secret, hashConfig.reply, reply.id.toString());

    // Check if there was an error generating the hash
    if (error) {
      // Throw the error
      throw error;
    }

    // Update the story with the hash
    await reply.update({ hash }, { transaction: t });

    // add the reply to the queue
    await addJob(reply);

    // commit transaction
    await t.commit();

    return {
      reply: {
        kind: reply.kind,
        author: reply.author,
        parent: reply.parent,
        hash: reply.hash,
        content: reply.content,
        views: reply.views,
        likes: reply.likes,
        replies: reply.replies
      },
      error: null
    }

  } catch (error) {
    // rollback transaction
    await t.rollback();
    // console.log(error);
    return {reply: null, error: error}
  }
}

// add afterCreate hook to increment the replies count of the story/reply
const addJob = async reply => {
  // construct the job payload: for queueing
  const payload = {
    kind: reply.kind,
    hashes: {
      target: reply.parent,
    },
    action: 'reply',
    value: 1,
  };

  // add the job to the queue
  await actionQueue.add('actionJob', payload);
};


/**
 * @function editReply
 * @description a function that edits a reply in the database
 * @param {Object} data - The reply data object
*/
const editReply = async data => {
  // start a transaction
  const transaction = sequelize.transaction();

  try {
    // find the reply to edit
    const reply = await Reply.findOne({where: {hash: data.hash, author: data.author}}, {transaction});

    // check if the reply exists
    if (!reply) {
      return {reply: null, error: null}
    }

    // edit the reply
    await reply.update(data, {transaction});

    // commit transaction
    await transaction.commit();

    return {
      reply: {
        kind: reply.kind,
        author: reply.author,
        parent: reply.parent,
        hash: reply.hash,
        content: reply.content,
        views: reply.views,
        likes: reply.likes,
        replies: reply.replies
      },
      error: null
    }
  } 
  catch (error) {
    // rollback transaction
    await transaction.rollback();
    return {reply: null, error: error}
  }
}

/**
 * @function removeReply
 * @description a function that removes a reply from the database
 * @param {String} data- The data object
 * @returns {Object} data - The deleted(true, false, null) and error if any
*/
const removeReply = async data => {
 
  try {
    // destroy the reply
    const result = await Reply.destroy({ where: { author: data.author, hash: data.hash } });

    // check if the reply was deleted
    if (result === 1) {
      return { deleted: true, error: null };
    }
    else {
      return { deleted: false, error: null };
    }
  } 
  catch (error) {
    return {deleted: null, error: error}
  }
}

// Export all functions
module.exports = {
  addReply,
  editReply,
  removeReply
}