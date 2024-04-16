// Importing from internal modules
const {
  addOpinion, editOpinion, removeOpinion, replyOpinion,
} = require('../queries').opinionQueries;

const { validateOpinionData } = require('../validators').opinionValidator;


// Create new opinion
const createOpinion = async (req, res, next) => {
  // Check if the payload or params is valid
  if (!req.body || !req.user || !req.params) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get story hash from params
  const storyHash = req.params.storyHash;

  // Get user id from user data
  const userId = req.user.id;

  // Get opinion data from payload
  const data = req.body;

  // Validate the opinion data
  const valObj = await validateOpinionData(data);

  // If validation failed, return the error
  if (valObj.error) {
    return res.status(400).json({
      success: false,
      message: valObj.error.message
    })
  }

  // Add the opinion
  const {
    opinion,
    error
  } = await addOpinion(userId, storyHash, valObj.data);

  // If error occurred, return the error
  if (error) {
    return next(error);
  }

  // Return the success message
  return res.status(201).json({
    success: true,
    message: 'Your opinion was added successfully!',
    opinion
  })
}


// Add Reply Opinion
const createReplyOpinion = async (req, res, next) => {
  // Check if the payload or params is valid
  if (!req.body || !req.user || !req.params) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get opinion hash from params
  const opinionHash = req.params.opinionHash;

  // Get user id from user data
  const userId = req.user.id;

  // Get opinion data from payload
  const data = req.body;

  // Validate the opinion data
  const valObj = await validateOpinionData(data);

  // If validation failed, return the error
  if (valObj.error) {
    return res.status(400).json({
      success: false,
      message: valObj.error.message
    })
  }

  // Add the opinion
  const {
    opinion,
    error
  } = await replyOpinion(userId, opinionHash, valObj.data);

  // If error occurred, return the error
  if (error) {
    return next(error);
  }

  // Return the success message
  return res.status(201).json({
    success: true,
    message: 'Your opinion was added successfully!',
    opinion
  })
}

// Edit opinion
const updateOpinion = async (req, res, next) => {
  // Check if the payload or params is valid
  if (!req.body || !req.user || !req.params) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get opinion hash from params
  const opinionHash = req.params.opinionHash;

  // console.log(opinionHash);

  // Get user id from user data
  const userId = req.user.id;

  // Get opinion data from payload
  const data = req.body;

  // Validate the opinion data
  const valObj = await validateOpinionData(data);

  // console.log(valObj.data);

  // If validation failed, return the error
  if (valObj.error) {
    return res.status(400).json({
      success: false,
      message: valObj.error.message
    })
  }

  // Edit the opinion
  const {
    opinion,
    authorized,
    error
  } = await editOpinion(userId, opinionHash, valObj.data);

  // If error occurred, return the error
  if (error) {
    return next(error);
  }

  // Check if the opinion was not found
  if (!opinion) {
    return res.status(404).json({
      success: false,
      message: 'The opinion you are trying to edit was not found!'
    })
  }

  // Check if author is was false (meaning the user isn't the author)
  if (!authorized) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to edit this opinion!'
    })
  }

  // Return the success message
  return res.status(200).json({
    success: true,
    message: 'Your opinion was edited successfully!',
    opinion
  })
}

// Controller for deleting/removing opinion
const deleteOpinion = async (req, res, next) => {
  // Check if the payload or params is valid
  if (!req.params || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get opinion hash from params
  const opinionHash = req.params.opinionHash;

  // Get user id from user data
  const userId = req.user.id;

  // Delete the opinion
  const {
    opinion,
    authorized,
    error
  } = await removeOpinion(userId, opinionHash);

  // If error occurred, return the error
  if (error) {
    return next(error);
  }

  // Check if there no opinion was found
  if (!opinion) {
    return res.status(404).json({
      success: false,
      message: 'The opinion you are trying to delete was not found!'
    })
  }

  // Check of author is was false (meaning the user isn't the author)
  if (!authorized) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to delete this opinion!'
    })
  }

  // Return the success message
  return res.status(200).json({
    success: true,
    message: 'Your opinion was deleted successfully!'
  })
}

// Export all controllers
module.exports = {
  createOpinion,
  updateOpinion, deleteOpinion,
  createReplyOpinion
}