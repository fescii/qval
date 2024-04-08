// noinspection JSUnresolvedReference

module.exports = (User, sequelize, Sequelize) => {
  // Creating a system table (carrying all system info)
  const System = sequelize.define("system", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    logo: {
      type: Sequelize.STRING,
      allowNull: true
    },
  }, 
  {
    schema: 'platform',
    freezeTableName: true
  });

  // Create section table to store info about various section of the app
  const Section = sequelize.define("sections", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identity: {
      type: Sequelize.STRING,
      allowNull: false
    },
    target: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
  },
  {
    schema: 'platform',
    freezeTableName: true
  });


  // Create section table to store info about various section of the app
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    section: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    user: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    base: {
      type: Sequelize.ENUM('owner', 'admin', 'user'),
      defaultValue: 'user',
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    privileges: {
      type: Sequelize.JSON,
      allowNull: true
    },
    expired: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  },
  {
    schema: 'platform',
    freezeTableName: true
  });

  // Creating approval table for approving any type of request in the platform
  const Approval = sequelize.define("approvals", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    target: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    approved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  },
  {
    schema: 'platform',
    freezeTableName: true
  });

  // Creating table for roles for managing & storing roles
  const Log = sequelize.define("logs", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    audit: {
      type: Sequelize.ENUM('request', 'security', 'error', 'action'),
      allowNull: false
    },
    user: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    target: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    action: {
      type: Sequelize.ENUM('create', 'read', 'update', 'delete'),
      allowNull: false
    },
    verb: {
      type: Sequelize.STRING,
      allowNull: true
    },
  },
  {
    schema: 'platform',
    freezeTableName: true
  });

  // Defining the associations
  Section.hasMany(Role, { foreignKey: 'section', });
  Role.belongsTo(Section, { foreignKey: 'section', as: 'section_roles' });

  User.hasMany(Role, { foreignKey: 'user' });
  Role.belongsTo(User, { foreignKey: 'user', as: 'user_roles' });

  User.hasMany(Log, { foreignKey: 'user' });
  Log.belongsTo(User, { foreignKey: 'user', as: 'user_logs' });

  return { System, Section, Role, Approval, Log }
}