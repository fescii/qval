const {Op} = require("sequelize");
const { Role } = require('../models').models;

const findRole = async (hash) => {
  
  try {
    const role = await Role.findOne({
      attributes: ['section', 'user', 'base', 'privileges'],
      where: {
        hash: hash
      }
    });
    
    if (role) {
      return { role: role, error: null}
    }
    else {
      // If a topic doesn't exist, returns both null
      return { role: null, error: null}
    }
  }
  catch (error) {
    return { role: null, error: error}
  }
}

const findUserRole = async (section, user) => {
  
  try {
    const role = await Role.findOne({
      attributes: ['section', 'user', 'base', 'privileges'],
      where: {
        [Op.and]: [
          {section: section},
          {user: user}
        ]
      }
    });
    
    if (role) {
      return { role: role, error: null}
    }
    else {
      // If a topic doesn't exist, returns both null
      return { role: null, error: null}
    }
  }
  catch (error) {
    return { role: null, error: error}
  }
}

module.exports = {
  findRole,  findUserRole
}