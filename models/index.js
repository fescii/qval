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

const db = {};

// Adding sequelize to db object
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importing from account schema models
const { User } = require('./user.model')(sequelize, Sequelize);
Object.assign(db, { User })

// Importing from platform schema models
const {
  System, Section,
  Role, Approval, Log
} = require('./platform.model')(User, sequelize, Sequelize);
Object.assign(db, { System, Section, Role, Approval, Log })

// Importing story schema models
const {
  Story, Upvote,
  Opinion, Like
} = require('./story.model')(User, sequelize, Sequelize);
Object.assign(db, { Story, Upvote, Opinion, Like })

//Sync database functions
const { syncDb } = require('./sync.models')(sequelize);
Object.assign(db, { syncDb });

module.exports = db;