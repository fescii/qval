// import the sequelize models
const { sequelize, TopicSection, Draft } = require('../../models').models;

/**
 * @function addTopicSection
 * @description Query to add a new section to a topic
 * @param {Authors} author - The authors of the section
 * @param {String} topicHash - The hash of the topic to add the section to
 * @param {Object} data - The data of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const addTopicSection = async (author, topicHash, data) => {
  try {
    // Trying to create a topic to the database
    const section = await TopicSection.create({
      topic: topicHash,
      order: data.order,
      title: data.title,
      content: data.content,
      authors: [author]
    });

    // return the topic created
    return { section, error: null };
  }
  catch (error) {
    return { section: null, error };
  }
}


/**
 * @function fetchTopicSections
 * @description Query to get all sections of a topic
 * @param {String} topicHash - The hash of the topic to get sections from
 * @returns {Object} - The topic sections object or null, and the error if any
*/
const fetchTopicSections = async (topicHash) => {
  try {
    // Get all sections of a topic
    const sections = await TopicSection.findAll({
      where: {
        topic: topicHash
      }
    });

    // return the sections
    return { sections, error: null };
  }
  catch (error) {
    return { sections: null, error };
  }
}

/**
 * @function editTopicSection
 * @description Query to edit a section of a topic
 * @param {Number} sectionId - The id of the section to edit
 * @param {Object} data - The data of the section
 * @returns {Object} - The section object or null, and the error if any
*/
const editTopicSection = async (data) => {
  // initialize transaction
  const transaction = await sequelize.transaction();

  try {
    // find the section
    const section = await TopicSection.findOne({
      where: {  id: data.section }
    }, {transaction});

    // check if the section exists
    if (!section) {
      return { section: null, error: null };
    }

    // check if the order of the section is not the same
    if (section.order !== data.order) {
      // adjust the order of the sections
      await adjustSectionOrders(section.topic, data.order, transaction, section.id);
    }

    // edit the section
    section.order = data.order;
    section.title = data.title;
    section.content = data.content;

    // save the section
    await section.save({transaction});

    // commit the transaction
    await transaction.commit();

    // return the section
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
 * @param {String} topicHash - The hash of the topic to adjust the sections
 * @param {Number} start - The start order of the section
 * @param {Object} transaction - The transaction object
 * @param {Number} exclude - The id of the section to exclude
 * @returns {Object} - The sections object or null, and the error if any
*/
const adjustSectionOrders = async (topic, start, transaction, exclude) => {
  // update the order of the sections from the start : order = order + 1
  await TopicSection.update(
    { order: sequelize.literal('order + 1')}, 
    {
      where: {
        topic: topic,
        order: {
          [sequelize.Op.gte]: start
        },
        id: {
          [sequelize.Op.ne]: exclude
        }
      }
    }, {transaction}
  );
}


/**
 * @function removeTopicSection
 * @description Query to remove a section of a topic
 * @param {Number} sectionId - The id of the section to remove
 * @returns {Object} - The section object or null, and the error if any
*/
const removeTopicSection = async (sectionId) => {
  try {
    // destroy the section
    const result = await TopicSection.destroy({
      where: {
        id: sectionId
      }
    });

    // check if the section was destroyed
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
 * @function addDraft
 * @description Query to add a draft to a section
 * @param {String} author - The author of the draft: the hash of the author
 * @param {Object} data - The data of the draft
 * @returns {Object} - The draft object or null, and the error if any
*/
const addDraft = async (author, data) => {
  try {
    // Trying to create a draft to the database
    const draft = await Draft.create({
      kind: data.kind,
      section: data.section,
      order: data.order,
      author: author,
      title: data.title,
      content: data.content,
      approved: false
    });

    // return the draft created
    return { draft, error: null };
  }
  catch (error) {
    return { draft: null, error };
  }
}

/**
 * @function editDraft
 * @description Query to edit a draft
 * @param {Number} draftId - The id of the draft to edit
 * @param {String} author - The hash of the author
 * @param {Object} data - The data of the draft
 * @returns {Object} - The draft object or null, and the error if any
*/
const editDraft = async (author, draftId, data) => {
  // initialize transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the draft
    const draft = await Draft.findOne({
      where: {
        id: draftId,
        author: author
      }
    });

    // If the draft exists, edit the draft
    if (draft) {
      draft.order = data.order;
      draft.title = data.title;
      draft.content = data.content;

      await draft.save({transaction});

      await transaction.commit();

      return { draft, error: null };
    }
    else {
      // If the draft doesn't exist, return both null
      return { draft: null, error: null };
    }
  }
  catch (error) {
    await transaction.rollback();
    return { draft: null, error };
  }
}

/**
 * @function approveDraft
 * @description Query to approve a draft
 * @param {Number} draftId - The id of the draft to approve
 * @returns {Object} data - The payload data
 * @returns {Object} - The draft object or null, and the error if any
*/
const approveDraft = async (data) => {
  // initialize transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the draft
    const draft = await Draft.findOne({
      where: {
        id: data.draft
      }
    });

    // If the draft exists, approve the draft
    if (draft) {
      draft.approved = data.approved;

      await draft.save({transaction});

      await transaction.commit();

      return { draft, error: null };
    }
    else {
      // If the draft doesn't exist, return both null
      return { draft: null, error: null };
    }
  }
  catch (error) {
    await transaction.rollback();
    return { draft: null, error };
  }
}

/**
 * @function removeDraft
 * @description Query to remove a draft
 * @param {Number} draftId - The id of the draft to remove
 * @returns {Object} - The draft object or null, and the error if any
*/
const removeDraft = async (draftId) => {
  try {
    // destroy the draft
    const result = await Draft.destroy({
      where: {
        id: draftId
      }
    });

    // check if the draft was destroyed
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


// Export the module
module.exports = {
  addTopicSection, fetchTopicSections, editTopicSection,
  removeTopicSection, addDraft,
  editDraft, approveDraft, removeDraft
}