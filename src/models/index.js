const { dbConfig } = require('../configs').storageConfig;
const Sequelize = require("sequelize");


// Initialize Sequelize with the database configuration
/**
 * @type {Sequelize}
 * @name sequelize
 * @description - This object contains the sequelize instance
 * @property {string} dbConfig.DB - The database name
 * @property {string} dbConfig.USER - The database user
 * @property {string} dbConfig.PASSWORD - The database password
 * @property {string} dbConfig.HOST - The database host
 * @property {string} dbConfig.dialect - The database dialect
 * @property {Object} dbConfig.pool - The database pool configuration
 * @property {Number} dbConfig.pool.max - The database pool max connections
 * @property {Number} dbConfig.pool.min - The database pool min connections
 * @property {Number} dbConfig.pool.acquire - The database pool acquire
 * @property {Number} dbConfig.pool.idle - The database pool idle
*/
let sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

/**
 * @type {Object}
 * @name models
 * @description - This object contains the models
 * @property {Sequelize} sequelize - The sequelize instance
 * @property {Sequelize} Sequelize - The sequelize class
 * @property {Object} Account - The account schema models
 * @property {Object} Platform - The platform schema models
 * @property {Object} Content - The story schema models
 * @property {Object} TopicSchema - The topic schema models
*/


// Importing from account schema models
const {
  User, Code, Connect
} = require('./user')(sequelize, Sequelize);


// Importing from platform schema models
const {
  System, Section, Approval, Role, Log
} = require('./platform')(User, sequelize, Sequelize);


// Importing story schema models
const {
  Story, Reply, View, Like, StorySection, Vote
} = require('./story')(User, sequelize, Sequelize);

// Importing topic schema models
const {
  Topic, Tagged, Subscribe, Follow, TopicSection, Draft
} = require('./topic')(User, Story, View, sequelize, Sequelize);

const {
  Activity
} = require('./activity')(sequelize, Sequelize, User);


// Import database sync function
const { syncDb } = require('./sync')(sequelize);

const models = {
  sequelize, Sequelize,
  User, Code, Connect, 
  System, Section, Approval, Role, Log,
  Story, Reply, View, Like, StorySection, Vote,
  Topic, Tagged, Subscribe, Follow, TopicSection, Draft,
  Activity
}

// Export the models object
module.exports =  {
  models, syncDb
};