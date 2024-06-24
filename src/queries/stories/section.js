// import the sequelize models
const { sequelize, TopicSection, Draft, Sequelize } = require('../../models').models;

// import op from sequelize
const Op = Sequelize.Op;


/**
 * @function addStorySection
 * @description Query to add a new section to a story
 * @param {String} story - The hash of the story to add the section to
 * @param {Object} data - The data of the story
 * @returns {Object} - The story object or null, and the error if any
*/
const addStorySection = async (story, data) => {
  // initialize transaction
  const transaction = await sequelize.transaction();

  // add story to data
  data.story = story;

  try {
    // Trying to create a story to the database
    const section = await TopicSection.create(data, {transaction});

    // adjust the order of the sections
    await adjustSectionOrders(section.story, data.order, transaction, section.id);

    // commit the transaction
    await transaction.commit();

    // return the story created
    return { section, error: null };
  }
  catch (error) {
    await transaction.rollback();
    return { section: null, error };
  }
}

// Export the module
module.exports = {
}