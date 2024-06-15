const { hashConfig} = require('../../configs');
const {Op} = require("sequelize");
const { sequelize, Topic, TopicSection, Draft } = require('../../models').models;

// Imports for gen_hash
const { gen_hash } = require("../../wasm");
const { auth } = require('../../configs/mpesa.config');
const  { hash_secret } = require("../../configs").envConfig;


/**
 * @function addTopicSection
 * @description Query to add a new section to a topic
 * @param {Authors} authors - The authors of the section
 * @param {String} topicHash - The hash of the topic to add the section to
 * @param {Object} data - The data of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const addTopicSection = async (authors, topicHash, data) => {
  try {
    // Trying to create a topic to the database
    const topic = await Topic.create({
      topic: topicHash,
      order: data.order,
      title: data.title,
      content: data.content,
      authors: authors
    }, {transaction});

    // return the topic created
    return { topic, error: null };
  }
  catch (error) {
    return { topic: null, error };
  }
}

/**
 * @function getTopicSections
 * @description Query to get all sections of a topic
 * @param {String} topicHash - The hash of the topic to get sections from
 * @returns {Object} - The topic sections object or null, and the error if any
*/
const getTopicSections = async (topicHash) => {
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
 * @function updateTopicSection
 * @description Query to update a section of a topic
 * @param {Array} authors - The authors of the section
 * @param {Number} sectionId - The id of the section to update
 * @param {Object} data - The data of the section
 * @returns {Object} - The section object or null, and the error if any
*/
const updateTopicSection = async (authors, sectionId, data) => {
  // initialize transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the section
    const section = await TopicSection.findOne({
      where: {
        id: sectionId
      }
    });

    // If the section exists, update the section
    if (section) {
      section.order = data.order;
      section.title = data.title;
      section.content = data.content;

      // save unique authors in the authors array: don't repeat authors
      section.authors = [...new Set([...section.authors, ...authors])];

      await section.save({transaction});

      await transaction.commit();

      return { section, error: null };
    }
    else {
      // If the section doesn't exist, return both null
      return { section: null, error: null };
    }
  }
  catch (error) {
    await transaction.rollback();
    return { section: null, error };
  }
}

/**
 * @function addDraft
 * @description Query to add a draft to a section
 * @param {Number} sectionId - The id of the section if available to add the draft to
 * @param {String} author - The author of the draft: the hash of the author
 * @param {Object} data - The data of the draft
 * @returns {Object} - The draft object or null, and the error if any
*/
const addDraft = async (sectionId, author, data) => {
  try {
    // Trying to create a draft to the database
    const draft = await Draft.create({
      kind: data.kind,
      section: sectionId,
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
 * @function updateDraft
 * @description Query to update a draft
 * @param {Number} draftId - The id of the draft to update
 * @param {Object} data - The data of the draft
 * @returns {Object} - The draft object or null, and the error if any
*/
const updateDraft = async (draftId, data) => {
  // initialize transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the draft
    const draft = await Draft.findOne({
      where: {
        id: draftId
      }
    });

    // If the draft exists, update the draft
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
const approveDraft = async (draftId, data) => {
  // initialize transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the draft
    const draft = await Draft.findOne({
      where: {
        id: draftId
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




// Export the module
module.exports = {
  addTopicSection, getTopicSections, updateTopicSection,
  addDraft, updateDraft, approveDraft
}