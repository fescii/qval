// noinspection JSUnresolvedReference

/**
 * @name - story.model
 * @module models/story.model
 * @description - This file contains the model for the story module / schema
 * @param {Object} User - User model
 * @param {Object} sequelize - Sequelize object
 * @param {Object} Sequelize - Sequelize module
 * @returns {Object} - Returns object containing all the models
*/
module.exports = (User, sequelize, Sequelize) => {

  /**
   * @type {Model}
   * @name Story
   * @description - This model contains all the story info
   * @property {Number} id - Unique identifier for the story
   * @property {String} kind - The kind of story (story, post, poll, article, blog, news, journal)
   * @property {Number} author - The author of the story
   * @property {String} hash - The hash of the story/ usually a unique identifier generated from hash algorithms(sha256)
   * @property {String} title - The title of the story
   * @property {String} slug - The slug of the story, a unique identifier for the story
   * @property {String} content - The content of the story
   * @property {String} body - The body of the story
   * @property {Array} topics - The topics of the story. an array of strings
   * @property {Number} views - The number of views the story has
   * @property {Number} total_upvotes - The total number of upvotes the story has
   * @property {Number} total_opinions - The total number of opinions the story has
  */
  const Story = sequelize.define("stories", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kind: {
        type: Sequelize.ENUM('story', 'post', 'poll', 'article', 'blog', 'news', 'journal'),
        defaultValue: 'post',
        allowNull: false
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
      title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      topics: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: []
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      total_upvotes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      total_opinions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
    },
    {
      schema: 'story',
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ['id', 'slug', 'hash']
        },
        {
          fields: ['kind', 'author', 'title']
        }
      ]
    });


  /**
   * @type {Model}
   * @name Upvote
   * @description - This model contains all the upvotes info
   * @property {Number} id - Unique identifier for the upvote
   * @property {Number} author - The author who has made the upvote
   * @property {String} story - The story the upvote is made on
  */
  const Upvote = sequelize.define("upvotes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      story: {
        type: Sequelize.STRING,
        allowNull: false
      },
    },
    {
      schema: 'story',
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ['id']
        },
        {
          fields: ['author', 'story']
        }
      ]
    });


  /**
   * @type {Model}
   * @name Opinion
   * @description - This model contains all the opinion info
   * @property {Number} id - Unique identifier for the opinion
   * @property {String} story - The story the opinion is made on
   * @property {String} opinion - The opinion which the opinion is made on
   * @property {Number} author - The author who has made the opinion
   */
  const Opinion = sequelize.define("opinions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      story: {
        type: Sequelize.STRING,
        allowNull: true
      },
      opinion: {
        type: Sequelize.STRING,
        allowNull: true
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
      body: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      total_upvotes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      total_opinions: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
    },
    {
      schema: 'story',
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ['id', 'hash']
        },
        {
          fields: ['opinion', 'author', 'story']
        }
      ]
    });

  /**
   * @type {Model}
   * @name Like
   * @description - This model contains all the likes info
   * @property {Number} id - Unique identifier for the like
   * @property {Number} author - The author who has made the like
   * @property {String} opinion - The opinion the like is made on
  */
  const Like = sequelize.define("likes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      opinion: {
        type: Sequelize.STRING,
        allowNull: false
      },
    },
    {
      schema: 'story',
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ['id']
        },
        {
          fields: ['author', 'opinion']
        }
      ]
    });

  // Defining the associations
  User.hasMany(Story, { foreignKey: 'author' });
  Story.belongsTo(User, { foreignKey: 'author', as: 'user_stories', onDelete: 'CASCADE' });

  User.hasMany(Upvote, { foreignKey: 'author' });
  Upvote.belongsTo(User, { foreignKey: 'author', as: 'user_upvotes', onDelete: 'CASCADE' });

  Story.hasMany(Upvote, { foreignKey: 'story', sourceKey: 'hash', onDelete: 'CASCADE'});
  Upvote.belongsTo(Story, { foreignKey: 'story', targetKey: 'hash', as: 'story_upvotes', onDelete: 'CASCADE' });

  Story.hasMany(Opinion, { foreignKey: 'story', sourceKey: 'hash', onDelete: 'CASCADE'});
  Opinion.belongsTo(Story, { foreignKey: 'story', targetKey: 'hash', as: 'story_opinions', onDelete: 'CASCADE' });

  User.hasMany(Opinion, { foreignKey: 'author' });
  Opinion.belongsTo(User, { foreignKey: 'author', as: 'user_opinions', onDelete: 'CASCADE' });

  Opinion.hasMany(Opinion, { foreignKey: 'opinion', sourceKey: 'hash', onDelete: 'CASCADE'});
  Opinion.belongsTo(Opinion, { foreignKey: 'opinion', targetKey: 'hash', as: 'opinion_replies', onDelete: 'CASCADE' });

  Opinion.hasMany(Like, { foreignKey: 'opinion', sourceKey: 'hash', onDelete: 'CASCADE'});
  Like.belongsTo(Opinion, { foreignKey: 'opinion', targetKey: 'hash', as: 'opinion_likes', onDelete: 'CASCADE' });

  User.hasMany(Like, { foreignKey: 'author' });
  Upvote.belongsTo(Story, { foreignKey: 'author', as: 'user_likes', onDelete: 'CASCADE' });

  // Returning the models
  return { Story, Opinion, Upvote, Like }
}