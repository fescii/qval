const { dbConfig } = require('../configs')
const Sequelize = require("sequelize");


// noinspection JSValidateTypes
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

const models = {};

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

//Sync database functions
const { syncDb } = require('./sync.models')(sequelize);

module.exports =  {
  Sequelize, sequelize, models,
  syncDb
};