// Importing the required modules, fns, configs, and utils...
const { Vote } = require('../../models').models;

/**
 * @function addVote
 * @description a function that adds a new vote to the database
 * @param {String} user - The hash of the user
 * @param {String} story - The target of the vote: usually the hash of a story or a reply.
 * @param {Number} option - The option of the vote: should be a number
 * @returns {Object} data - The added vote object and error if any
*/
const addVote = async (user, story, option) => {
  // add author & parent to the data
  const data = { author: user, story, option };

  try {
    // create a new vote
    const vote = await Vote.create(data);

    return {
      vote: { story: vote.story, author: vote.author, option: vote.option },
      error: null
    };
  }
  catch (error) {
    return { vote: null, error };
  }
}


// Exporting the fns...
module.exports = {
  addVote
}
