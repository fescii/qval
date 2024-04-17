// Import within the app
const { Like, Opinion } = require("../models").models;

// A hook function for updating of total upvotes in a opinion
const likeHook = async (like) => {
  try {
    // const like = job.data; // Data contains the like object
    const opinionHash = like.opinion;
    const totalLikes = await Like.count({ where: { opinion: opinionHash } });
    await Opinion.update({ total_likes: totalLikes }, { where: { id: opinionHash } });
  }
  catch (error) {
    console.error('Error initializing upvote hook process:', error);
    // TODO: Create a handler for handling this error
  }
}
// Export all hooks
module.exports = {
  likeHook
};
