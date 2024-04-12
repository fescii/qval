const bcrypt = require("bcryptjs");
const { hashNumberWithKey } = require('../hash').identityHash;
const {hashConfig} = require("../configs");
const { User, sequelize } = require("../models").models;


const addUser = async (data) => {
  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    // Trying to create new user to the database
    const user = await User.create({
      username: data.username,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      password: bcrypt.hashSync(data.password, 8)
    }, {transaction})
    
    user.username = await hashNumberWithKey(hashConfig.user, user.id);
    
    // console.log(user)
    
    await user.save({transaction});
    
    await transaction.commit();
    
    // On success return data
    return { user: user, error: null}
  } catch (err) {
    // console.log(err)
    await transaction.rollback();
    return { user: null, error: err}
  }
}

// Check if the user already exists using: - email
const checkIfUserExits = async (userEmail) => {
  try{
    const user = await User.findOne({
      where: {
        email: userEmail
      }
    });
    
    // console.log(user)
    if (user) {
      // console.log('This code runs')
      return { user: user, error: null}
    }
    else {
      return {user: null, error: null}
    }
  }
  catch (error) {
    return {user: null, error: error}
  }
}

module.exports = {
  addUser, checkIfUserExits
}