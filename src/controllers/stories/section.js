// impoet all section queries from the storyQueries
const {
  addStorySection, editStorySection, removeStorySection
} = require('../../queries').storyQueries;

const { checkAuthority } = require('../../utils').roleUtil;
const { Privileges } = require('../../configs').platformConfig;

/**
 * @function createStorySection
 * @description Controller for adding a new section to a story
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const createStorySection = async (req, res, next) => {
  // Check if the user or payload is available
  const { hash } = req.params;

  if (!req.section || !req.user || !hash) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.section;
  // add author & parent to the data
  data.story = hash.toUpperCase();

  // Create access data - (For authorizing user)
  const access = {
    section: hash.toUpperCase(),
    privilege: Privileges.Update,
    user: req.user.id,
    key: 'action'
  }

  // Check if the user has access to update the story
  const hasAccess = await checkAuthority(access);

  // If user does not have access return unauthorized
  if (!hasAccess) {
    return res.status(401).send({
      success: false,
      message: "You are not authorized to update this story!"
    });
  }

  // Add story to the database
  const {
    section,
    error
  } = await addStorySection(data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Return the response
  return res.status(201).send({
    success: true,
    section: section,
    message: "Section was added successfully!",
  });
}

/**
 * @function updateStorySection
 * @description Controller for updating a section in a story
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const updateStorySection = async (req, res, next) => {
  // Check if the user or payload is available
  const { hash, id } = req.params;

  if (!req.section || !req.user || !hash || !id) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.section;
  data.story = hash.toUpperCase();
  data.id =  id;

  // Create access data - (For authorizing user)
  const access = {
    section: hash.toUpperCase(),
    privilege: Privileges.Update,
    user: req.user.id,
    key: 'action'
  }

  // Check if the user has access to update the story
  const hasAccess = await checkAuthority(access);

  // If user does not have access return unauthorized
  if (!hasAccess) {
    return res.status(401).send({
      success: false,
      message: "You are not authorized to update this story!"
    });
  }

  // Update story in the database
  const {
    section,
    error
  } = await editStorySection(data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Return the response
  return res.status(200).send({
    success: true,
    section: section,
    message: "Section was updated successfully!",
  });
}

/**
 * @function deleteStorySection
 * @description Controller for deleting a section in a story
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Returns response object
*/
const deleteStorySection = async (req, res, next) => {
  // Check if the user or payload is available
  const { hash, id } = req.params;

  if (!hash || !req.user || !id) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // create data object
  const section = {
    story: hash.toUpperCase(),
    id: id
  }

  // Create access data - (For authorizing user)
  const access = {
    section: hash.toUpperCase(),
    privilege: Privileges.Delete,
    user: req.user.id,
    key: 'action'
  }

  // Check if the user has access to update the story
  const hasAccess = await checkAuthority(access);

  // If user does not have access return unauthorized
  if (!hasAccess) {
    return res.status(401).send({
      success: false,
      message: "You are not authorized to update this story!"
    });
  }

  // Delete story in the database
  const {
    deleted,
    error
  } = await removeStorySection(section);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // check if the section was deleted
  if (!deleted) {
    return res.status(404).send({
      success: false,
      message: "Section you are trying to delete does not exist!"
    });
  }

  // Return the response
  return res.status(200).send({
    success: true,
    message: "Section was deleted successfully!",
  });
}

module.exports = {
  createStorySection,
  updateStorySection,
  deleteStorySection
}