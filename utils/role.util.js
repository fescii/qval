const { findUserRole } = require('../queries').roleQueries;
const { RoleBase } = require('../configs').platformConfig;

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