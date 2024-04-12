// noinspection JSUnresolvedReference

module.exports = (User, sequelize, Sequelize) => {
  // Creating a Topic table - tags
  const Topic = sequelize.define("topics", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      hash: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true
      },
    },
    {
      schema: 'topic',
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ['id', 'slug', 'hash']
        },
        {
          fields: ['name', 'author', 'about']
        }
      ]
    });
  
  // Create intersection table for many-to-many relationship between tables
  const Tagged = sequelize.define("tagged", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      topic: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      target: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    },
    {
      schema: 'topic',
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ['id']
        },
        {
          fields: ['topic', 'target']
        }
      ]
    });
  
  // Create upvote table to store all upvotes on post/story
  const Subscribe = sequelize.define("subscribers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      topic: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    },
    {
      schema: 'topic',
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ['id']
        },
        {
          fields: ['author', 'topic']
        }
      ]
    });
  
  
  
  // Defining the associations
  User.hasMany(Topic, { foreignKey: 'author' });
  Topic.belongsTo(User, { foreignKey: 'author', as: 'user_topics', onDelete: 'CASCADE' });
  
  Topic.hasMany(Tagged, { foreignKey: 'topic' });
  Tagged.belongsTo(Topic, { foreignKey: 'topic', as: 'topic_tagged', onDelete: 'CASCADE' });
  
  Topic.hasMany(Subscribe, { foreignKey: 'topic' });
  Subscribe.belongsTo(Topic, { foreignKey: 'topic', as: 'topic_subscribers', onDelete: 'CASCADE' });
  
  return { Topic, Tagged, Subscribe }
}