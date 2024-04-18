// noinspection JSUnresolvedReference

/**
 * @name - platform.model
 * @module models/platform.model
 * @description - This file contains the model for the platform module
 * @param {Object} User - User model
 * @param {Object} sequelize - Sequelize object
 * @param {Object} Sequelize - Sequelize module
 * @returns {Object} - Returns object containing all the models
*/
module.exports = (User, sequelize, Sequelize) => {
  /**
   * @type {Model}
   * @name System
   * @description - This model contains all the system info
   * @property {Number} id - The system id
   * @property {String} name - The system name
   * @property {String} description - The system description
   * @property {String} logo - The system logo
   */
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

  /**
   * @type {Model}
   * @name Section
   * @description - This model contains all the section info
   * @property {Number} id - The section id
   * @property {String} identity - The section identity, usually a unique string identifier
   * @property {Number} target - The section target, Model to which the section is made from
   * @property {String} name - The section name
   * @property {String} description - The section description
  */
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


  /**
   * @type {Model}
   * @name Role
   * @description - This model contains all the role info for each section
   * @property {Number} id - The role id
   * @property {String} section - The role section identity to which the role created
   * @property {Number} user - The role user: the user id to which the role is assigned
   * @property {String} base - The role base: An enum field with values owner, admin, user
   * @property {String} name - The role name
   * @property {Object} privileges - The role privileges object
   * @property {Date} expiry - The role expiry
   * @property {Boolean} expired - The role expired
  */
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    section: {
      type: Sequelize.STRING,
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
    expiry: {
      type: Sequelize.DATE,
      allowNull: true,
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

  /**
   * @type {Model}
   * @name Approval
   * @description - This model contains all the approval info for each request in the platform
   * @property {Number} id - The approval id
   * @property {Number} target - The approval target(Model id where the request is made)
   * @property {String} name - The approval name(Mostly the modal name where the request is made)
   * @property {Boolean} approved - A boolean field storing weather or not the request is approved
   * @property {String} description - The approval description
  */
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

  /**
   * @type {Model}
   * @name Log
   * @description - This model contains all the logs info in the platform which are generated by the system
   * @property {Number} id - The log id
   * @property {String} audit - The log audit type, an enum field with values request, security, error, action
   * @property {Number} user - The log user id, the user who's action generated the log
   * @property {Number} target - The log target id, the Model id field where the action is made
   * @property {String} action - The log action type, the action type performed by the user when the log was generated
   * @property {String} verb - The log verb, used to describe the action performed by the user/log
  */
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

  /**
   * This is the association between the models
  */
  Section.hasMany(Role, { foreignKey: 'section', sourceKey: 'identity' });
  Role.belongsTo(Section, { foreignKey: 'section', targetKey: 'identity', as: 'section_roles', onDelete: 'CASCADE' });

  User.hasMany(Role, { foreignKey: 'user' });
  Role.belongsTo(User, { foreignKey: 'user', as: 'user_roles', onDelete: 'CASCADE' });

  User.hasMany(Log, { foreignKey: 'user' });
  Log.belongsTo(User, { foreignKey: 'user', as: 'user_logs', onDelete: 'CASCADE' });

  /**
   * This is the object containing all the models
  */
  return { System, Section, Role, Approval, Log }
}