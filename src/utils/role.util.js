const { findUserRole } = require('../queries').roleQueries;
const { RoleBase } = require('../configs').platformConfig;

/**
 * @function checkAuthority
 * @name checkAuthority
 * @description Check if a user has the authority to perform an action
 * @param {Object} access - The access object
 * @returns {Boolean} - The result
 */
const checkAuthority = async (access) => {
  const {
    role,
    error
  } = await findUserRole(access.section, access.user);

  if (error) {
    return false;
  }

  if (!role) {
    return false;
  }

  if (role.base === RoleBase.Owner) {
    return true;
  }

  const privileges = role.privileges;

  if (privileges.hasOwnProperty(access.key)) {
    return privileges[access.key].includes(access["privilege"]);
  }
  else {
    return false
  }
}

module.exports = {
  checkAuthority
}