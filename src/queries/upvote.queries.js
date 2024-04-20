// Import from within the app
const { sequelize, Upvote, Like } = require("../models").models;
const { upvoteQueue } = require('../bull');


/**
 * @function upvoteQuery
 * @description Query to create or delete an upvote
 * @param {String} storyHash - The hash of the story
 * @param {String} userId - The id of the user
 * @returns {Object} - The number of upvotes, and the error if any
 */
const upvoteQuery = async (storyHash, userId) => {
  // Create a new transaction
  const transaction = await sequelize.transaction();

  // Try to create or delete the upvote
  try {
    const [upvote, created] = await Upvote.findOrCreate({
      where: { story: storyHash, author: userId },
      defaults: {
        story: storyHash,
        author: userId,
      },
      transaction: transaction
    });

    // Add the upvote to the queue
    await upvoteQueue.add('upvoteJob', upvote);

    // If the upvote was created return positive (+1)
    if (created) {
      // Commit the transaction
      await transaction.commit();
      return { number: 1, error: null };
    }
    else {
      // Delete the upvote
      await upvote.destroy({ transaction });

      // Commit the transaction
      await transaction.commit();
      return { number: -1, error: null};
    }
  }
  catch(error){
    // Rollback the transaction
    await transaction.rollback();

    return { number: 0, error: error };
  }
}

/**
 * @function likeQuery
 * @description Query to create or delete a like
 * @param {String} opinionHash - The hash of the opinion
 * @param {String} userId - The id of the user
 * @returns {Object} - The number of likes, and the error if any
*/
const likeQuery = async (opinionHash, userId) => {
  // Create a new transaction
  const transaction = await sequelize.transaction();

  // Try to create or delete the like
  try {
    const [like, created] = await Like.findOrCreate({
      where: { opinion: opinionHash, author: userId },
      defaults: {
        opinion: opinionHash,
        author: userId,
      },
      transaction: transaction
    });

    // Add the upvote to the queue
    await upvoteQueue.add('upvoteJob', like);

    // If the like was created return positive (+1)
    if (created) {
      // Commit the transaction
      await transaction.commit();
      return { number: 1, error: null };
    }
    else {
      // Delete the like
      await like.destroy({ transaction });

      // Commit the transaction
      await transaction.commit();
      return { number: -1, error: null };
    }
  }
  catch (error) {
    // Rollback the transaction
    await transaction.rollback();

    return { number: 0, error: error };
  }
}

// Export the query functions
module.exports = {
  upvoteQuery,
  likeQuery
}