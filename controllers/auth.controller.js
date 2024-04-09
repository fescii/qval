// Importing from modules
const bcrypt = require("bcryptjs");

// Importing within the app
const db = require("../models");
const { tokenUtil, hashUtil } = require('../utils');
const { userValidator } = require('../validators');

// Models objects
const { User, sequelize } = db;

// Controller to register new users
const signUp = async (req, res, next) => {
  // Get validated payload data from request object
  const data = req.reg_data;
  
  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    // Trying to create new user to the database
    const user = await User.create({
      username: data.username,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      password: bcrypt.hashSync(data.password, 8)
    }, { transaction })
    
    user.username = await hashUtil.hashNumberWithKey('U', user.id);
    
    await user.save({ transaction });
    
    await transaction.commit();

    // On success return response to the user
    return res.status(200).send({
      success: true,
      user: {
        name: user.name,
        username: user.username,
        email: user.email
      },
      message: "User was registered successfully!"
    });
  }
  catch (err) {
    await transaction.rollback();
    await next(err);
  }
};

// Controller to log in user into the system
const signIn = async (req, res) => {
  // Get user data from request body
  const payload = req.body;

  try {
    const validatedData = await userValidator.validateLoginData(payload);

    // Check if Username or Email is available using a single query
    try {
      const user = await User.findOne({
        where: {
          email: validatedData.email
        }
      });

      // If no user is found, return 404(Not found)
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User Not found." 
        });
      }

      // Compare passwords
      let passwordIsValid = bcrypt.compareSync(
        validatedData.password,
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

      res.status(200).send({
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
    catch (error) {
      return res.status(500).send({
        success: false,
        message: "An error occurred while trying to login!"
      });
    }
  }
  catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  signUp, signIn
}