// import the sequelize models
const { sequelize, StorySection, Sequelize } = require('../../models').models;

// import op from sequelize
const Op = Sequelize.Op;


/**
 * @function addStorySection
 * @description Query to add a new section to a story
 * @param {Object} data - The data of the story
 * @returns {Object} - The story section or error
*/
const addStorySection = async data => {
  // initialize transaction
  const transaction = await sequelize.transaction();

  try {
    // Trying to create a story to the database
    const section = await StorySection.create(data, {transaction});

    // adjust the order of the sections
    await adjustSectionOrders(section.story, section.order, transaction, section.id);

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

/**
 * @function editStorySection
 * @description Query to update a section of a story
 * @param {Object} data - The data of the section
 * @returns {Object} - The section object or null, and the error if any
*/
const editStorySection = async data => {
  // initialize transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the section
    const section = await StorySection.findOne({ where: { story: data.story, id: data.id } }, {transaction});

    // Check if the section exists
    if (!section) {
      return { section: null, error: null };
    }

    // if old order is different from new order
    if (section.order !== data.order) {
      // adjust the order of the sections
      await adjustSectionOrders(section.story, section.order, transaction, section.id);
    }

    // Update the section
    await section.update(data, {transaction});


    // commit the transaction
    await transaction.commit();

    // return the section updated
    return { section, error: null };
  }
  catch (error) {
    await transaction.rollback();
    return { section: null, error };
  }
}

/**
 * @function adjustSectionOrders
 * @description Query to adjust the order of sections
 * @param {String} story - The hash of the story to adjust the sections
 * @param {Number} start - The start order of the section
 * @param {Object} transaction - The transaction object
 * @param {Number} exclude - The id of the section to exclude
 * @returns {Object} - The sections object or null, and the error if any
*/
const adjustSectionOrders = async (story, start, transaction, exclude) => {
  // update the order of the sections from the start : order = order + 1
  await StorySection.update(
    { order: Sequelize.literal('"order" + 1')},
    {
      where: {
        story: story,
        order: {
          [Op.gte]: start
        },
        id: {
          [Op.ne]: exclude
        }
      }
    }, {transaction}
  );
}

/**
 * @function removeStorySection
 * @description Query to remove a section from a story
 * @param {String} story - The hash of the story to remove the section
 * @param {Number} id - The id of the section to remove
 * @returns {Object} - The section object or null, and the error if any
*/
const removeStorySection = async data => {
  try {
    // destroy the section
    const result = await StorySection.destroy({ where: { story: data.story, id: data.id } });

    // check if the section was deleted
    if (result === 1) {
      return { deleted: true, error: null };
    }
    else {
      return { deleted: false, error: null };
    }
  }
  catch (error) {
    return { deleted: null, error };
  }
}

/**
 * @function fetchStorySections
 * @description Query to get all sections of a story ordered by their order
 * @param {String} data - The hash of the story to get sections from
 * @returns {Object} - The story sections object or null, and the error if any
*/
const fetchStorySections = async data => {
  try {
    // Get all sections of a story, ordered by order
    const sections = await StorySection.findAll({
      where: {
        story: data.story
      },
      order: [
        ['order', 'ASC']
      ]
    });

    // check if the sections are empty
    if (sections.length === 0) {
      return { sections: null, error: null };
    }

    // return the sections
    return { sections, error: null };
  } catch (error) {
    console.log(error);
    return { sections: null, error };
  }
}

// Export the module
module.exports = {
  addStorySection, editStorySection, removeStorySection,
  fetchStorySections
}