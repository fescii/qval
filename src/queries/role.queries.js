const {Op} = require("sequelize");
const { Role } = require('../models').models;


/**
 * @function findRole
 * @description Query to find a role by hash
 * @param {String} hash - The hash of the role
 * @returns {Object} - The role object or null, and the error if any
*/
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

/**
 * @function findUserRole
 * @description Query to find a role by section and user
 * @param {String} section - The section of the role
 * @param {String} user - The user of the role
 * @returns {Object} - The role object or null, and the error if any
*/
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