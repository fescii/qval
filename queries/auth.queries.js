const bcrypt = require("bcryptjs");
const {hashUtil} = require("../utils");
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
    
    user.username = await hashUtil.hashNumberWithKey(hashConfig.user, user.id);
    
    await user.save({transaction});
    
    await transaction.commit();
    
    // On success return data
    return { data: user, error: null}
  } catch (err) {
    await transaction.rollback();
    return { data: null, error: err}
  }
}

// Check if the user already exists using: - email
const checkIfUserExits = async (email) => {
  try{
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    
    if (user) {
      return { data: user, error: null}
    }
    else {
      return {data: null, error: null}
    }
  }
  catch (error) {
    return {data: null, error: error}
  }
}

module.exports = {
  addUser, checkIfUserExits
}