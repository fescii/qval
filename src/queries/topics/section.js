// import the sequelize models
const { sequelize, TopicSection, Draft, Sequelize } = require('../../models').models;

// import op from sequelize
const Op = Sequelize.Op;


/**
 * @function addTopicSection
 * @description Query to add a new section to a topic
 * @param {Authors} author - The authors of the section
 * @param {String} topic - The hash of the topic to add the section to
 * @param {Object} data - The data of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const addTopicSection = async (author, topic, data) => {
  // initialize transaction
  const transaction = await sequelize.transaction();

  const insertData = {
    ...data,
    topic,
    authors: [author]
  }

  try {
    // Trying to create a topic to the database
    const section = await TopicSection.create(insertData, {transaction});

    // adjust the order of the sections
    await adjustSectionOrders(section.topic, data.order, transaction, section.id);

    // commit the transaction
    await transaction.commit();

    // return the topic created
    return { section, error: null };
  }
  catch (error) {
    await transaction.rollback();
    return { section: null, error };
  }
}


/**
 * @function fetchTopicSections
 * @description Query to get all sections of a topic
 * @param {String} topic - The hash of the topic to get sections from
 * @returns {Object} - The topic sections object or null, and the error if any
*/
const fetchTopicSections = async (topic) => {
  try {
    // Get all sections of a topic: order by order
    const sections = await TopicSection.findAll({
      where: {
        topic: topic
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
    console.log(error);
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
    { order: Sequelize.literal('"order" + 1')},
    {
      where: {
        topic: topic,
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
 * @function removeTopicSection
 * @description Query to remove a section of a topic
 * @param {Number} section - The id of the section to remove
 * @returns {Object} - The section object or null, and the error if any
*/
const removeTopicSection = async (section) => {
  try {
    // destroy the section
    const result = await TopicSection.destroy({
      where: {
        id: section
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
 * @param {Object} data - The data of the draft
 * @returns {Object} - The draft object or null, and the error if any
*/
const addDraft = async (data) => {
  try {
    // get draft data
    const draftData = await getDraftData(data);

    // Trying to create a draft using the draft data
    const draft = await Draft.create(draftData);

    // return the draft created
    return { draft, error: null };
  }
  catch (error) {
    return { draft: null, error };
  }
}

/**
 * @function getDraftData
 * @description A function to get the data of a draft
 * @param {Object} data - The id of the draft
 * @returns {Object} - The draft object
*/
const getDraftData = async (data) => {
  // check if kind new and section is not null
  if (data.kind === 'update' && data.section) {
    
    return {
      kind: data.kind,
      author: data.author,
      topic: data.topic,
      section: data.section,
      order: data.order,
      title: data.title,
      content: data.content
    };
  }
  else {
    return {
      kind: data.kind,
      topic: data.topic,
      author: data.author,
      section: null,
      order: data.order,
      title: data.title,
      content: data.content
    };
  }
}

/**
 * @function editDraft
 * @description Query to edit a draft
 * @param {Number} draftId - The id of the draft to edit
 * @param {Object} data - The data of the draft
 * @returns {Object} - The draft object or null, and the error if any
*/
const editDraft = async (data) => {
  // initialize transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the draft
    const draft = await Draft.findOne({
      where: {
        id: data.draft,
        author: data.author
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

    // check if the draft does not exist
    if (!draft) {
      return { result: null, error: null };
    }

    // check if the kind is update and section is not null
    if (draft.kind === 'update' && draft.section) {
      // If the draft exists, merge the draft to the section
      const { section, error } = await mergeDraftToSection(draft, transaction);

      // check for error
      if (error) {
        // throw the error
        throw error;
      }

      // destroy the draft
      await draft.destroy({ transaction });

      // commit the transaction
      await transaction.commit();

      return { result: section, error: null };
    }

    // create a new section using the draft data
    const { section, error } = await createSectionFromDraft(draft, data.authorizer, transaction);

    // check for error
    if (error) {
      // throw the error
      throw error;
    }

    // destroy the draft
    await draft.destroy({ transaction });

    // commit the transaction
    await transaction.commit();

    return { result: section, error: null };
  }
  catch (error) {
    await transaction.rollback();
    return { draft: null, error };
  }
}


/**
 * @function mergeDraftToSection
 * @description Query to merge a draft to a section
 * @param {Object} draft - The data of the draft
 * @param {Object} transaction - The transaction object
 * @returns {Object} - The section object or null, and the error if any
*/
const mergeDraftToSection = async (draft, transaction) => {
  try {
    // fetch the section
    const section = await TopicSection.findOne({
      where: {
        id: draft.section,
        topic: draft.topic
      }
    }, { transaction });

    // check if the section does not exist
    if (!section) {
      // throw an error
      throw new Error('Section you\'re trying to update does not exist');
    }

    // check if order is not the same
    if (section.order !== draft.order) {
      // adjust the order of the sections
      await adjustSectionOrders(section.topic, draft.order, transaction, section.id);
    }

    // update the section using the draft data
    section.order = draft.order;
    section.content = draft.content;

    // merge section authors: append draft author to section authors and it has to be unique
    const authors = section.authors;
    const author = draft.author;
    if (!authors.includes(author)) {
      authors.push(author);
    }

    // update the authors
    section.authors = authors;

    // check if the title is not null
    if (draft.title !== null) {
      section.title = draft.title;
    }

    // save the section
    await section.save({ transaction });

    // return the section
    return { section, error: null };
  
  } catch (error) {
    // return the error
    return { section: null, error };
  }
}

/**
 * @function createSectionFromDraft
 * @description Query to create a section from a draft
 * @param {Object} draft - The data of the draft
 * @param {Object} authorizer - The authorizer hash
 * @param {Object} transaction - The transaction object
 * @returns {Object} - The section object or null, and the error if any
*/
const createSectionFromDraft = async (draft, authorizer, transaction) => {
  try {
    // create author array from the draft author and authorizer
    const authors = [];
    if (draft.author === authorizer) {
      authors.push(draft.author);
    }
    else {
      authors.push(draft.author, authorizer);
    }

    // create a new section using the draft data
    const section = await TopicSection.create({
      topic: draft.topic,
      order: draft.order,
      title: draft.title,
      authors:  authors,
      content: draft.content
    }, { transaction });

    // adjust the order of the sections
    await adjustSectionOrders(section.topic, draft.order, transaction, section.id);

    // return the section
    return { section, error: null };
  }
  catch (error) {
    return { section: null, error };
  }
}

/**
 * @function fetchDrafts
 * @description Query to get all drafts of a topic
 * @param {String} topic - The hash of the topic to get drafts from
 * @returns {Object} - The drafts object or null, and the error if any
*/
const fetchDrafts = async (topic) => {
  try {
    // Get all drafts of a topic: order by order
    const drafts = await Draft.findAll({
      where: {
        topic: topic
      },
      order: [
        ['order', 'ASC']
      ]
    });

    // check if the drafts are empty
    if (drafts.length === 0) {
      return { drafts: null, error: null };
    }

    // return the drafts
    return { drafts, error: null };
  }
  catch (error) {
    return { drafts: null, error };
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
  removeTopicSection, addDraft, fetchDrafts,
  editDraft, approveDraft, removeDraft
}