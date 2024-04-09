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
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ]
  });

  // Create section table to store info about various sections of the app
  const Section = sequelize.define("sections", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identity: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
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
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['id', 'identity']
      }
    ]
  });


  // Create role table to store info about all privileges of each section
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
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['id']
      },
      {
        fields: ['section', 'user', 'base']
      }
    ]
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
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['id']
      },
      {
        fields: ['target', 'name', 'approved']
      }
    ]
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
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['id']
      },
      {
        fields: ['audit', 'user', 'target', 'action']
      }
    ]
  });

  // Defining the associations
  Section.hasMany(Role, { foreignKey: 'section', });
  Role.belongsTo(Section, { foreignKey: 'section', as: 'section_roles', onDelete: 'CASCADE' });

  User.hasMany(Role, { foreignKey: 'user' });
  Role.belongsTo(User, { foreignKey: 'user', as: 'user_roles', onDelete: 'CASCADE' });

  User.hasMany(Log, { foreignKey: 'user' });
  Log.belongsTo(User, { foreignKey: 'user', as: 'user_logs', onDelete: 'CASCADE' });

  return { System, Section, Role, Approval, Log }
}