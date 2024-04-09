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
const Account = require('./user.model')(sequelize, Sequelize);
// const { User } = require('./user.model')(sequelize, Sequelize);
Object.assign(db, Account)

// Importing from platform schema models
const Platform = require('./platform.model')(Account.User, sequelize, Sequelize);
Object.assign(db, Platform)

// Importing story schema models
const Content = require('./story.model')(Account.User, sequelize, Sequelize);
Object.assign(db, Content)

// Importing topic schema models
const TopicSchema = require('./topic.model')(Account.User, sequelize, Sequelize);
Object.assign(db, TopicSchema);

//Sync database functions
const { syncDb } = require('./sync.models')(sequelize);
Object.assign(db, { syncDb });

// console.log(db)

module.exports = db;