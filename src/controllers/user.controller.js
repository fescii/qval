// Import necessary packages and modules
const upload = require('../middlewares').upload;
const {
  editPicture, editBio, editContact,
  editPassword, editEmail, editName
} = require('../queries').userQueries;

const {
  validateBio, validateContact, validateName,
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
  if (!req.user) {
    return res.status(400).json({
      success: false,
      error: true,
      message: 'File or user not found in the payload'
    });
  }
  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      // If file is not defined
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: true,
          message: 'File not found in the payload'
        });
      }

      const username = req.user.username;
      const { path } = req.file;

      const {
        user,
        error
      } = await editPicture(path, username);

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
      message: validatedData.error.message
    });
  }

  const {
    user,
    error
  } = await editBio(validatedData.data.bio, username);

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
      message: validatedData.error.message
    });
  }

  const {
    user,
    error
  } = await editContact(validatedData.data.contact, username);

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
      message: validatedData.error.message
    });
  }

  const {
    user,
    error
  } = await editEmail(validatedData.data.email, username);

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
      message: validatedData.error.message
    });
  }

  const {
    user,
    error
  } = await editPassword(validatedData.data.password, username);

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

/**
 * @name updateProfileName
 * @function updateProfileName
 * @description A controller function to update a user's profile name
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Object} - Returns response object
*/
const updateProfileName = async (req, res, next) => {
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

  // Validate the name
  const validatedData = await validateName(payload);

  // Check if there was an error validating the name
  if (validatedData.error) {
    return res.status(400).json({
      success: false,
      message: validatedData.error.message
    });
  }

  const {
    user,
    error
  } = await editName(validatedData.data.name, username);

  // Check if there was an error updating the user's profile name
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
      name: user.name,
    },
    message: 'Profile name updated successfully',
  });
}

// Export the module
module.exports = {
  updateProfilePicture,
  updateProfileBio,
  updateProfileContact,
  updateProfileEmail,
  updateProfilePassword,
  updateProfileName
}