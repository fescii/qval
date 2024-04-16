// Import within the app
const { Like, Opinion } = require("../models").models;

// A hook function for updating of total upvotes in a opinion
const likeHook = async (like) => {

  try {
    // Sequelize hook to update total_likes when a new like is added or removed
    Like.afterCreate(async (like) => {
      const opinionId = like.opinion;
      const totalLikes = await Like.count({ where: { opinion: opinionId } });
      await Opinion.update({ total_likes: totalLikes }, { where: { id: opinionId } });
    });
  }
  catch (error) {
    // Report this error
    console.log(error);
  }
}

// Export all hooks
module.exports = {
  likeHook
};
