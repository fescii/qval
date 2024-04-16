// Import from within the app (internal modules)
const { upvoteQuery, likeQuery } = require('../queries').upvoteQueries;

// Controller for creating or deleting an upvote on a story
const upvoteController = async (req, res, next) => {
  // Check if the user or params is valid
  if (!req.user || !req.params) {
    const error = new Error('Param data or user data is undefined!');
    return next(error)
  }

  // Get story hash from params
  const storyHash = req.params.storyHash;

  // Get user id from user data
  const userId = req.user.id;

  // Perform the upvote query
  const { number, error } = await upvoteQuery(storyHash, userId);

  // If error occurred, return the error
  if (error) {
    return next(error);
  }

  // Return the success message
  return res.status(200).json({
    success: true,
    number: number,
    message: `Your upvote was ${action === 1 ? 'added' : 'removed'}.`,
  });
};

// Controller for liking a an opinion
const likeController = async (req, res, next) => {
  // Check if the user or params is valid
  if (!req.user || !req.params) {
    const error = new Error('Param data or user data is undefined!');
    return next(error)
  }

  // Get opinion hash from params
  const opinionHash = req.params.opinionHash;

  // Get user id from user data
  const userId = req.user.id;

  // Perform the like query
  const { number, error } = await likeQuery(opinionHash, userId);

  // If error occurred, return the error
  if (error) {
    return next(error);
  }

  // Return the success message
  return res.status(200).json({
    success: true,
    number: number,
    message: `Your like was ${action === 1 ? 'added' : 'removed'}.`,
  });
};