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

  console.log('data', data);

  try {
    // create a new vote
    const vote = await Vote.findOrCreate({
      where: {story: story, author: user},
      defaults: data
    });

    return {
      vote: vote,
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
