// import the necessary queries
const {
  addTopicSection, editTopicSection, removeTopicSection,
  addDraft, editDraft, approveDraft, removeDraft
} = require('../../queries').topicQueries;


// importing validators
const {
  validateDraft, validateSection
} = require('../../validators').topicValidator;

/** 
 * @function createTopicSection
 * @description Controller for creating a new topic section
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const createTopicSection = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.body || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // validate the request body
  const valObj = await validateSection(req.body);

  // Handling data validation error
  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Get user data from request object
  const userHash = req.user.hash;

  const {
    section,
    error
  } = await addTopicSection(userHash, valObj.data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  return res.status(201).send({
    success: true,
    section,
    message: "Topic section was created successfully!"
  });
};

/**
 * @function updateTopicSection
 * @description Controller for updating a topic section
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateTopicSection = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.body || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // validate the request body
  const valObj = await validateSection(req.body);

  // Handling data validation error
  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Get user data from request object
  const userHash = req.user.hash;

  const {
    section,
    error
  } = await editTopicSection(userHash, valObj.data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // if section is not found
  if (!section) {
    return res.status(404).send({
      success: false,
      message: "Section you are trying to update was not found!"
    });
  }

  return res.status(200).send({
    success: true,
    section,
    message: "Topic section was updated successfully!"
  });
};

/** 
 * @function deleteTopicSection
 * @description Controller for deleting a topic section
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const deleteTopicSection = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.body || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // get section id from request body
  const sectionId = req.body.section;

  // check if section id is available
  if (!sectionId) {
    const error = new Error('Section is not defined!');
    return next(error);
  }

  const {
    deleted,
    error
  } = await removeTopicSection(sectionId);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // check if section was deleted
  if (!deleted) {
    return res.status(404).send({
      success: false,
      message: "Section not found!"
    });
  }

  return res.status(200).send({
    success: true,
    message: "Topic section was deleted successfully!"
  });
};


/**
 * @function createDraft
 * @description Controller for creating a new topic draft
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const createDraft = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.body || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // validate the request body
  const valObj = await validateDraft(req.body);

  // Handling data validation error
  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Get user data from request object
  const userHash = req.user.hash;

  const {
    draft,
    error
  } = await addDraft(userHash, valObj.data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  return res.status(201).send({
    success: true,
    draft,
    message: "Draft was created successfully!"
  });
};

/**
 * @function updateDraft
 * @description Controller for updating a topic draft
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object 
*/
const updateDraft = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.body || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // validate the request body
  const valObj = await validateDraft(req.body);

  // Handling data validation error
  if (valObj.error) {
    return res.status(400).send({
      success: false,
      message: valObj.error.message
    });
  }

  // Get user data from request object
  const userHash = req.user.hash;

  const {
    draft,
    error
  } = await editDraft(userHash, valObj.data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // if draft is not found
  if (!draft) {
    return res.status(404).send({
      success: false,
      message: "Draft you are trying to update was not found!"
    });
  }

  // return success response
  return res.status(200).send({
    success: true,
    draft,
    message: "Draft was updated successfully!"
  });
};


/**
 * @function approveDraft
 * @description Controller for approving a topic draft
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const approveDraft = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.body || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // get draft id from request body
  const draftId = req.body.draft;

  // check if draft id is available
  if (!draftId) {
    const error = new Error('Draft is not defined!');
    return next(error);
  }

  const {
    draft,
    error
  } = await approveDraft(draftId);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // check if draft was approved
  if (!draft) {
    return res.status(404).send({
      success: false,
      message: "Draft not found!"
    });
  }

  return res.status(200).send({
    success: true,
    message: "Draft was approved successfully!"
  });
};

/**
 * @function deleteDraft
 * @description Controller for deleting a topic draft
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const deleteDraft = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.body || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // get draft id from request body
  const draftId = req.body.draft;

  // check if draft id is available
  if (!draftId) {
    const error = new Error('Draft is not defined!');
    return next(error);
  }

  const {
    deleted,
    error
  } = await removeDraft(draftId);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // check if draft was deleted
  if (!deleted) {
    return res.status(404).send({
      success: false,
      message: "Draft not found!"
    });
  }

  return res.status(200).send({
    success: true,
    message: "Draft was deleted successfully!"
  });
};

// Export the module
module.exports = {
  createTopicSection, updateTopicSection, deleteTopicSection,
  createDraft, updateDraft, approveDraft, deleteDraft
};