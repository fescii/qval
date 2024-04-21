// Import necessary packages and modules
const upload = require('../middlewares').upload;
const {
  updatePicture, updateBio, updateContact,
  updatePassword, updateEmail
} = require('../queries').userQueries;

const {
  validateBio, validateContact,
  validateEmail, validatePassword,
} = require('../validators').userValidator;


/**
 * @name updateProfilePicture
 * @function updateProfilePicture
 * @description A controller function to update a user's profile picture
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfilePicture = async (req, res, next) => {
  // Check if the payload contains a file
  if (!req.file || !req.user) {
    return res.status(400).json({
      success: false,
      error: true,
      message: 'File or user not found in the payload'
    });
  }
  try {
    upload.single('profilePicture')(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      const username = req.user.username;
      const { filename } = req.file.filename;

      const {
        user,
        error
      } = await updatePicture(filename, username);

      // Check if there was an error updating the user's profile picture
      if (error) {
        return next(error);
      }

      // Check if user is null
      if (!user) {
        return res.status(404).json({
          success: false,
          error: true,
          message: "The profile you are trying to update does not exist"
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          picture: user.picture,
          bio: user.bio,
        },
        message: 'Profile picture updated successfully',
      });
    });
  }
  catch (error) {
    return next(error);
  }
};


/**
 * @name updateProfileBio
 * @function updateProfileBio
 * @description A controller function to update a user's profile bio
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfileBio = async (req, res, next) => {
  // Check for payload or user
  if (!req.body || !req.user) {
    return res.status(400).json({
      success: false,
      error: true,
      message: 'Payload or user not found in the payload'
    });
  }

  const payload = req.body;
  const username = req.user.username;

  // Validate the bio
  const validatedData = await validateBio(payload);

  // Check if there was an error validating the bio
  if (validatedData.error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  const {
    user,
    error
  } = await updateBio(validatedData.data.bio, username);

  // Check if there was an error updating the user's profile bio
  if (error) {
    return next(error);
  }

  // Check if user is null
  if (!user) {
    return res.status(404).json({
      success: false,
      error: true,
      message: "The profile you are trying to update does not exist"
    });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      picture: user.picture,
      bio: user.bio,
    },
    message: 'Profile bio updated successfully',
  });
};


/**
 * @name updateProfileContact
 * @function updateProfileContact
 * @description A controller function to update a user's profile contact info
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfileContact = async (req, res, next) => {
  // Check for payload or user
  if (!req.body || !req.user) {
    return res.status(400).json({
      success: false,
      error: true,
      message: 'Payload or user not found in the payload'
    });
  }

  const payload = req.body;
  const username = req.user.username;

  // Validate the contact
  const validatedData = await validateContact(payload);

  // Check if there was an error validating the contact
  if (validatedData.error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  const {
    user,
    error
  } = await updateContact(validatedData.data.contact, username);

  // Check if there was an error updating the user's profile contact
  if (error) {
    return next(error);
  }

  // Check if user is null
  if (!user) {
    return res.status(404).json({
      success: false,
      error: true,
      message: "The profile you are trying to update does not exist"
    });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      picture: user.picture,
      bio: user.bio,
      contact: user.contact,
    },
    message: 'Profile contact updated successfully',
  });
};

/**
 * @name updateProfileEmail
 * @function updateProfileEmail
 * @description A controller function to update a user's profile email
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfileEmail = async (req, res, next) => {
  // Check for payload or user
  if (!req.body || !req.user) {
    return res.status(400).json({
      success: false,
      error: true,
      message: 'Payload or user not found in the payload'
    });
  }

  const payload = req.body;
  const username = req.user.username;

  // Validate the email
  const validatedData = await validateEmail(payload);

  // Check if there was an error validating the email
  if (validatedData.error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  const {
    user,
    error
  } = await updateEmail(validatedData.data.email, username);

  // Check if there was an error updating the user's profile email
  if (error) {
    return next(error);
  }

  // Check if user is null
  if (!user) {
    return res.status(404).json({
      success: false,
      error: true,
      message: "The profile you are trying to update does not exist"
    });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      picture: user.picture,
      bio: user.bio,
      contact: user.contact,
    },
    message: 'Profile email updated successfully',
  });
};

/**
 * @name updateProfilePassword
 * @function updateProfilePassword
 * @description A controller function to update a user's profile password
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfilePassword = async (req, res, next) => {
  // Check for payload or user
  if (!req.body || !req.user) {
    return res.status(400).json({
      success: false,
      error: true,
      message: 'Payload or user not found in the payload'
    });
  }

  const payload = req.body;
  const username = req.user.username;

  // Validate the password
  const validatedData = await validatePassword(payload);

  // Check if there was an error validating the password
  if (validatedData.error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  const {
    user,
    error
  } = await updatePassword(validatedData.data.password, username);

  // Check if there was an error updating the user's profile password
  if (error) {
    return next(error);
  }

  // Check if user is null
  if (!user) {
    return res.status(404).json({
      success: false,
      error: true,
      message: "The profile you are trying to update does not exist"
    });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      picture: user.picture,
      bio: user.bio,
      contact: user.contact,
    },
    message: 'Profile password updated successfully',
  });
}

// Export the module
module.exports = {
  updateProfilePicture,
  updateProfileBio,
  updateProfileContact,
  updateProfileEmail,
  updateProfilePassword
}