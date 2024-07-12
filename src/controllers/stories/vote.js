// Import all the vote queries from storyQueries
const { addVote } = require('../../queries').storyQueries;
const { addActivity } = require('../../bull');


/**
 * @function voteController
 * @description Controller for voting on a story
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const voteController = async (req, res, next) => {
  // get hash(story hash) from the params
  const { hash, option } = req.params;

  // check if the story hash is available in the request object
  if (!hash || !req.user || !option) {
    const error = new Error('Story hash option or user data is undefined!');
    return next(error);
  }

  let verifiedNumber = parseInt(option) || 1;

  // Like the story
  const {
    vote,
    error
  } = await addVote(req.user.hash, hash.toUpperCase(), verifiedNumber);

  // check if there is an error
  if (error) {
    return next(error);
  }

  // Add activity to the queue
  if (vote) {
    addActivity({
      kind: 'story', action: 'vote', author: req.user.hash, name: req.user.name,
      to: null, target: hash.toUpperCase(), verb: 'voted',
      nullable: false,
    });
  }

  // return response
  return res.status(200).json({
    success: true,
    vote: vote,
    message: 'You have successfully voted for the story!'
  });
}

// export vote controller
module.exports = {
  voteController
}