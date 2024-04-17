// Import from within the app
const { sequelize, Upvote, Like } = require("../models").models;


// A Query function for creating or deleting an upvote
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

// Query for creating or deleting a like
const likeQuery = async (opinionHash, userId) => {
  // Create a new transaction
  const transaction = await sequelize.transaction();

  // Try to create or delete the like
  try {
    const [like, created] = await Like.findOrCreate({
      where: { story: opinionHash, author: userId },
      defaults: {
        opinion: opinionHash,
        author: userId,
      },
      transaction: transaction
    });

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