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
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    slug: {
      type: Sequelize.STRING,
      unique: true,
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
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    },
    replies: {
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
   * @name Reply
   * @description - This model contains all the Reply info
   * @property {Number} id - Unique identifier for the Reply
   * @property {String} parent - The story/reply the Reply is made on
   * @property {Number} author - The author who has made the Reply
   */
  const Reply = sequelize.define("replies", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    parent: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    hash: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    views: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    },
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    },
    replies: {
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
          fields: ['content', 'author', 'parent']
        }
      ]
    });

  /**
   * @type {Model}
   * @name Like
   * @description - This model contains all the likes info
   * @property {Number} id - Unique identifier for the like
   * @property {Number} author - The user who has made the like
   * @property {String} item - The story/reply hash the like is made on
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
    item: {
      type: Sequelize.INTEGER,
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
          fields: ['author', 'item']
        }
      ]
    });

  /**
* @type {Model}
* @name View
* @description - This model contains all the Views info
* @property {Number} id - Unique identifier for the View
* @property {Number} author - The user who has made the View
* @property {String} item - The story/reply hash the View is made on
*/
  const View = sequelize.define("views", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    item: {
      type: Sequelize.INTEGER,
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
          fields: ['author', 'item']
        }
      ]
    });

  //--- Defining the associations ---//
  // User <--> Story
  User.hasMany(Story, { foreignKey: 'author', as: 'authored_stories' });
  Story.belongsTo(User, { foreignKey: 'author', as: 'author_user', onDelete: 'CASCADE' });

  // User <--> Reply association
  User.hasMany(Reply, { foreignKey: 'author' });
  Reply.belongsTo(User, { foreignKey: 'author', as: 'user_replies', onDelete: 'CASCADE' });

  // User <--> Like association
  User.hasMany(Like, { foreignKey: 'author' });
  Like.belongsTo(User, { foreignKey: 'author', as: 'user_likes', onDelete: 'CASCADE' });

  // User <-->> View association
  User.hasMany(View, { foreignKey: 'author' });
  View.belongsTo(User, { foreignKey: 'author', as: 'user_views', onDelete: 'CASCADE' });

  // Story <--> Reply association
  Story.hasMany(Reply, { foreignKey: 'parent', as: 'story_replies' });
  Reply.belongsTo(Story, { foreignKey: 'parent', as: 'parent_story', onDelete: 'CASCADE' });

  // Story <--> Like association
  Story.hasMany(Like, { foreignKey: 'item', as: 'story_likes' });
  Like.belongsTo(Story, { foreignKey: 'item', as: 'story_like', onDelete: 'CASCADE' });

  // Story <--> View association
  Story.hasMany(View, { foreignKey: 'item', as: 'story_views' });
  View.belongsTo(Story, { foreignKey: 'item', as: 'viewed_story', onDelete: 'CASCADE' });

  // Reply <--> Like association
  Reply.hasMany(Like, { foreignKey: 'item', as: 'reply_likes' });
  Like.belongsTo(Reply, { foreignKey: 'item', as: 'liked_reply', onDelete: 'CASCADE' });

  // Reply <--> View association
  Reply.hasMany(View, { foreignKey: 'item', as: 'reply_views' });
  View.belongsTo(Reply, { foreignKey: 'item', as: 'viewed_reply', onDelete: 'CASCADE' });

  return { Story, Reply, Like, View }
}