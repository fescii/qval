const { auth } = require("../configs/mpesa.config");

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
    }, { transaction });

    // If the upvote was created return positive (+1)
    if (created) {
      // Commit the transaction
      await transaction.commit();
      return { upvote: upvote, action: 1, error: null };
    }
    else {
      // Delete the upvote
      await upvote.destroy({ transaction });

      // Commit the transaction
      await transaction.commit();
      return { upvote: null, number: -1, error: null};
    }
  }
  catch(error){
    // Rollback the transaction
    await transaction.rollback();

    return { upvote: null, number: 0, error: error };
  }
}

// Query for creating or deleting a like
const likeQuery = async (storyHash, userId) => {
  // Create a new transaction
  const transaction = await sequelize.transaction();

  // Try to create or delete the like
  try {
    const [like, created] = await Like.findOrCreate({
      where: { story: storyHash, author: userId },
      defaults: {
        story: storyHash,
        author: userId,
      },
    }, { transaction });

    // If the like was created return positive (+1)
    if (created) {
      // Commit the transaction
      await transaction.commit();
      return { like: like, number: 1, error: null };
    }
    else {
      // Delete the like
      await like.destroy({ transaction });

      // Commit the transaction
      await transaction.commit();
      return { like: null, number: -1, error: null };
    }
  }
  catch (error) {
    // Rollback the transaction
    await transaction.rollback();

    return { like: null, number: 0, error: error };
  }
}

// Export the query functions
module.exports = {
  upvoteQuery,
  likeQuery
}