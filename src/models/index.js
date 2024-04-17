const { dbConfig } = require('../configs').storageConfig;
const Sequelize = require("sequelize");


// noinspection JSValidateTypes
// Initialize Sequelize with the database configuration
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

// Create an empty object to store the models
const models = {};

// Adding the sequelize instance to the models object
models.sequelize = sequelize;
models.Sequelize = Sequelize;

// Importing from account schema models
const Account = require('./user.model')(sequelize, Sequelize);
// const { User } = require('./user.model')(sequelize, Sequelize);
Object.assign(models, Account)

// Importing from platform schema models
const Platform = require('./platform.model')(Account.User, sequelize, Sequelize);
Object.assign(models, Platform)

// Importing story schema models
const Content = require('./story.model')(Account.User, sequelize, Sequelize);
Object.assign(models, Content)

// Importing topic schema models
const TopicSchema = require('./topic.model')(Account.User, sequelize, Sequelize);
Object.assign(models, TopicSchema);

// Import database sync function
const { syncDb } = require('./sync.models')(sequelize);

// Export the models object
module.exports =  {
  models, syncDb
};