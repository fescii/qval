// noinspection JSUnresolvedReference

module.exports = (User, sequelize, Sequelize) => {
  // Creating a Story/Post table (carrying all posts/stories/opinions info)
  const Story = sequelize.define("stories", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kind: {
        type: Sequelize.ENUM('story', 'post', 'poll', 'article', 'blog', 'news', 'journal'),
        defaultValue: 'story',
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
      body: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      topics: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: []
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
  
  // Create upvote table to store all upvotes on post/story
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
          fields: ['author', 'story']
        }
      ]
    });
  
  // Create an opinion table for all opinions and recursive replies
  const Opinion = sequelize.define("opinions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      story: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      parent: {
        type: Sequelize.INTEGER,
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
      topics: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: []
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
          fields: ['parent', 'author']
        }
      ]
    });
  
  // Create upvote table to store all upvotes(Like to distinguish) on post/story
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
          fields: ['author', 'opinion']
        }
      ]
    });

  // Defining the associations
  User.hasMany(Story, { foreignKey: 'author' });
  Story.belongsTo(User, { foreignKey: 'author', as: 'user_stories', onDelete: 'CASCADE' });
  
  User.hasMany(Upvote, { foreignKey: 'author' });
  Upvote.belongsTo(User, { foreignKey: 'author', as: 'user_upvotes', onDelete: 'CASCADE' });
  
  Story.hasMany(Upvote, { foreignKey: 'story' });
  Upvote.belongsTo(Story, { foreignKey: 'story', as: 'story_upvotes', onDelete: 'CASCADE' });
  
  Story.hasMany(Opinion, { foreignKey: 'story' });
  Opinion.belongsTo(Story, { foreignKey: 'story', as: 'story_opinions', onDelete: 'CASCADE' });
  
  User.hasMany(Opinion, { foreignKey: 'author' });
  Opinion.belongsTo(User, { foreignKey: 'author', as: 'user_opinions', onDelete: 'CASCADE' });
  
  Opinion.hasMany(Opinion, { foreignKey: 'opinion' });
  Opinion.belongsTo(Opinion, { foreignKey: 'opinion', as: 'opinion_replies', onDelete: 'CASCADE' });
  
  Opinion.hasMany(Like, { foreignKey: 'opinion' });
  Like.belongsTo(Opinion, { foreignKey: 'opinion', as: 'opinion_likes', onDelete: 'CASCADE' });
  
  User.hasMany(Like, { foreignKey: 'author' });
  Upvote.belongsTo(Story, { foreignKey: 'author', as: 'user_likes', onDelete: 'CASCADE' });
  
  return { Story, Opinion, Upvote, Like }
}