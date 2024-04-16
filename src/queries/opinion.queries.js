// Importing from internal modules
const { sequelize, Opinion, Story } = require('../models').models;
const { hashNumberWithKey } = require('../hash').identityHash;
const { hashConfig } = require('../configs');


// Check if Opinion exists using hash
const findOpinionByHash = async (hash) => {
  try {

    const opinion = await Opinion.findOne({
      where: { hash: hash }
    });

    // If opinion is returned by the query then return the opinion
    if (opinion) {
      return { opinion: opinion, error: null };
    }
    // Else return both null
    else {
      return { opinion: null, error: null };
    }
  }
  catch (error) {
    console.log(error);
    return { opinion: null, error: error };
  }
}

// Create a new Opinion
const addOpinion = async (userId, storyHash, data) => {

  // Start new transaction
  const transaction = await sequelize.transaction();

  // Try to create the opinion
  try {

    // Make sure the story exists before adding opinion
    const story = await Story.findOne({
      where: { hash: storyHash }
    }, { transaction });

    // If not story found then return null
    if (!story) {
      return {
        story: null,
        opinion: null,
        error: null
      };
    }

    const opinion = await Opinion.create({
      author: userId,
      story: story.hash,
      body: data.body,
    }, { transaction });

    // Create hash using opinion id
    opinion.hash = await hashNumberWithKey(hashConfig.opinion, opinion.id);

    // Save the opinion
    await opinion.save({ transaction });

    // Commit the transaction
    await transaction.commit();

    // If opinion is created then return the opinion
    return {
      story: story,
      opinion: opinion,
      error: null
    };
  }
  catch (error) {
    // Rollback the transaction
    await transaction.rollback();

    return {
      story: null,
      opinion: null,
      error: error
    };
  }
}

// Create a new Opinion of parent type
const replyOpinion = async (userId, opinionHash, data) => {

  // Start new transaction
  const transaction = await sequelize.transaction();

  // Try to create the opinion
  try {

    // Make sure the parent opinion exists before adding opinion
    const parentOpinion = await Opinion.findOne({
      where: { hash: opinionHash }
    }, { transaction });

    // If not parent opinion found then return null
    if (!parentOpinion) {
      return {
        parent: null,
        opinion: null,
        error: null
      };
    }

    // Create the opinion
    const opinion = await Opinion.create({
      author: userId,
      opinion: opinionHash,
      body: data.body,
    }, { transaction });

    // Create hash using opinion id
    opinion.hash = await hashNumberWithKey(hashConfig.opinion, opinion.id);

    // Save the opinion
    await opinion.save({ transaction });

    // Commit the transaction
    await transaction.commit();

    // If opinion is created then return the opinion
    return { opinion: opinion, error: null };
  }
  catch(error) {
    // Rollback the transaction
    await transaction.rollback();

    return { opinion: null, error: error };
  }
}

// Query for editing the opinion body
const editOpinion = async (userId, opinionHash, data) => {
  // Start a new transaction
  const transaction = await sequelize.transaction();

  // Try to update the opinion
  try {
    // console.log(typeof(opinionHash));

    // Find the opinion using hash
    const opinion = await Opinion.findOne({
      where: { hash: opinionHash }
    }, { transaction });

    // If opinion is found then update the body
    if (opinion) {
      // Check if the user is the author of the opinion
      if (opinion.author !== userId) {
        return {
          opinion: opinion,
          authorized: false,
          error: null
        };
      }

      // Update the body
      opinion.body = data.body;

      // Save the opinion
      await opinion.save();

      // Commit the transaction
      await transaction.commit();

      return { opinion: opinion, authorized: true, error: null };
    }
    // Else return null
    else {
      return { opinion: null, authorized: false, error: null };
    }
  }
  catch (error) {
    // Rollback the transaction
    await transaction.rollback();

    return { opinion: null, authorized: false, error: error };
  }
}


// Query for deleting/removing the opinion
const removeOpinion = async (userId, opinionHash) => {
  // Start a new transaction
  const transaction = await sequelize.transaction();

  // Try to delete the opinion
  try {
    // Find the opinion using hash
    const opinion = await Opinion.findOne({
      where: { hash: opinionHash }
    }, { transaction });

    // If opinion is found then delete the opinion
    if (opinion) {

      // Check if the user is the author of the opinion
      if (opinion.author !== userId) {
        return {
          opinion: opinion,
          authorized: false,
          error: null
        };
      }

      // Delete the opinion
      await opinion.destroy({ transaction });

      // Commit the transaction
      await transaction.commit();

      return { opinion: opinion, authorized: true, error: null };
    }
    // Else return null
    else {
      return { opinion: null, authorized: false, error: null };
    }
  }
  catch (error) {
    // Rollback the transaction
    await transaction.rollback();

    return { opinion: null, authorized: false, error: error };
  }
}


// Export the functions
module.exports = {
  findOpinionByHash, removeOpinion,
  addOpinion, replyOpinion, editOpinion
};