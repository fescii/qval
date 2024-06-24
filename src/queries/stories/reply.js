// Import all necessary modules, fns, and configs...
const { hashConfig } = require('../../configs');
const { sequelize, Sequelize, Reply } = require('../../models').models;
const { RoleBase } = require('../../configs').platformConfig;
const Op = Sequelize.Op;

// Imports for gen_hash
const { gen_hash } = require("../../wasm");
const  { hash_secret } = require("../../configs").envConfig;


/**
 * @function addReply
 * @description a function that adds a new reply to the database
 * @param {String} user - The hash of the user
 * @param {String} parent - The parent of the reply: usually the hash of a story or another reply.
 * @param {Object} data - The reply data object
 * @returns {Object} data - The added reply object and error if any
*/
const addReply = async (user, parent, data) => {
  // start a transaction
  const transaction = sequelize.transaction();
  // add author & parent to the data
  data.author = user;
  data.parent = parent;

  try {
    // create a new reply
    const reply = await Reply.create(data, {transaction});

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
    await reply.update({ hash }, { transaction });

    // commit transaction
    await transaction.commit();

    return {
      reply: {
        kind: reply.kind,
        author: reply.author,
        parent: reply.author,
        hash: reply.hash,
        content: reply.content,
        views: reply.content,
        likes: reply.likes,
        replies: reply.replies
      },
      error: null
    }

  } catch (error) {
    return {reply: null, error: error}
  }
}


/**
 * @function editReply
 * @description a function that edits a reply in the database
 * @param {String} user - The hash of the user
 * @param {String} hash - The hash of the reply
 * @param {Object} data - The reply data object
*/
const editReply = async (user, hash, data) => {
  // start a transaction
  const transaction = sequelize.transaction();

  try {
    // find the reply to edit
    const reply = await Reply.findOne({where: {hash, author: user}}, {transaction});

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
        parent: reply.author,
        hash: reply.hash,
        content: reply.content,
        views: reply.content,
        likes: reply.likes,
        replies: reply.replies
      },
      error: null
    }
  } 
  catch (error) {
    return {reply: null, error: error}
  }
}

/**
 * @function removeReply
 * @description a function that removes a reply from the database
 * @param {String} user - The hash of the user
 * @param {String} hash - The hash of the reply
 * @returns {Object} data - The deleted(true, false, null) and error if any
*/
const removeReply = async (user, hash) => {
 
  try {
    // destroy the reply
    const result = await Reply.destroy({ where: { author: user, hash } });

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