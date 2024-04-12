// Importing from modules
const bcrypt = require("bcryptjs");

// Importing within the app
const { tokenUtil } = require('../utils');
const { validateLoginData } = require('../validators').userValidator;

const { addUser, checkIfUserExits } = require('../queries').authQueries;

// Controller to register new users
const signUp = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.reg_data) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // Get validated payload data from request object
  const data = req.reg_data;

  // Get the user data from db;
  const {
    user,
    error
  } = await addUser(data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // On success return response to the user
  return res.status(201).send({
    success: true,
    user: {
      name: user.name,
      username: user.username,
      email: user.email
    },
    message: "User was registered successfully!"
  });
};

// Controller to log in user into the system
const signIn = async (req, res, next) => {
  // Check if the payload is available in the request object
  if (!req.body) {
    const error = new Error('Payload data is not defined in the req object!');
    return next(error);
  }

  // Get payload from request body
  const payload = req.body;

  const {
    data,
    error
  } =  await validateLoginData(payload);

  // If validation returns an error
  if (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }

  // Check if user with that email exists
  const {
    user,
    err
  } = await checkIfUserExits(data.email)

  // Passing the error to error middleware
  if (err) {
    return next(err);
  }

  // If no user is found, return 404(Not found)
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User Not found."
    });
  }

  // Compare passwords
  let passwordIsValid = bcrypt.compareSync(
    data.password,
    user.password
  );

  // If passwords do not match return 401(Unauthorized)
  if (!passwordIsValid) {
    return res.status(401).send({
      success: false,
      message: "Invalid Password!"
    });
  }

  let token = await tokenUtil.generateToken({
    id: user.id, email: user.email,
    username: user.username, name: user.name
  })

  return res.status(200).send({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      username: user.username
    },
    accessToken: token,
    message: "You're logged in successful!"
  });
}

module.exports = {
  signUp, signIn
}