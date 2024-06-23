// noinspection JSUnresolvedReference
// import actionQueue from '../bull';
const { actionQueue } = require('../bull');

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
   * @property {String} search - The search column for the story
   * @property {Number} views - The number of views the story has
   * @property {Number} likes - The total number of likes the story has
   * @property {Number} replies - The total number of replies the story has
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
    search: {
      type: Sequelize.TSVECTOR,
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
  },{
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

  // add afterSync hook to alter search column(title, content, slug) and create the GIN index
  Story.afterSync(() => {
    sequelize.query(`
      ALTER TABLE story.stories MODIFY COLUMN search TSVECTOR
      GENERATED ALWAYS AS (setweight(to_tsvector('pg_catalog.english', coalesce(title, '')), 'A') || setweight(to_tsvector('pg_catalog.english', coalesce(content, '')), 'B') || setweight(to_tsvector('pg_catalog.english', coalesce(slug, '')), 'C'));

      CREATE INDEX search_idx ON story.stories USING GIN(search);
    `);
  });


  // add search property to the story model
  Strory.search = async tsQuery => {
    return await Story.findAll({
      attributes: ['kind', 'author', 'hash', 'title', 'slug', 'content', 'topics', 'views', 'likes', 'replies'],
      where: sequelize.where(
        sequelize.fn('to_tsvector', 'english', sequelize.fn('concat' , sequelize.col('title'), ' ', sequelize.col('content'), ' ', sequelize.col('slug'))),
        '@@',
        tsQuery,
      ),
      order: sequelize.literal(`ts_rank_cd(search, ${tsQuery}) DESC`),
    })
  }

  /**
   * @type {Model}
   * @name Reply
   * @description - This model contains all the Reply info
   * @property {Number} id - Unique identifier for the Reply
   * @property {String} kind - The kind of Reply (reply to a story or reply to a reply)
   * @property {String} parent - The story/reply the Reply is made on
   * @property {Number} author - The author who has made the Reply
   * @property {String} hash - The hash of the Reply/ usually a unique identifier generated from hash algorithms(sha256)
   * @property {String} content - The content of the Reply
   * @property {String} search - The search column for the Reply
   * @property {Number} views - The number of views the Reply has
   * @property {Number} likes - The total number of likes the Reply has
   * @property {Number} replies - The total number of replies the Reply has
  */
  const Reply = sequelize.define("replies", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kind: {
      type: Sequelize.ENUM('story', 'reply'),
      allowNull: false
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    parent: {
      type: Sequelize.STRING,
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
    search: {
      type: Sequelize.TSVECTOR,
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

  // add afterSync hook to alter search column(content) and create the GIN index
  Reply.afterSync(() => {
    sequelize.query(`
      ALTER TABLE story.replies MODIFY COLUMN search TSVECTOR
      GENERATED ALWAYS AS (setweight(to_tsvector('pg_catalog.english', coalesce(content, '')), 'A'));

      CREATE INDEX search_idx ON story.replies USING GIN(search);
    `);
  });

  // add search property to the reply model
  Reply.search = async tsQuery => {
    return await Reply.findAll({
      attributes: ['kind', 'author', 'parent', 'hash', 'content', 'views', 'likes', 'replies'],
      where: sequelize.where(
        sequelize.fn('to_tsvector', 'english', sequelize.fn('concat' , sequelize.col('content'))),
        '@@',
        tsQuery,
      ),
      order: sequelize.literal(`ts_rank_cd(search, ${tsQuery}) DESC`),
    })
  }

  // add afterCreate hook to increment the replies count of the story/reply
  Reply.afterCreate(async reply => {
    // construct the job payload: for queueing
    const payload = {
      kind: reply.kind,
      action: 'create',
      hashes: {
        target: reply.parent,
      },
      action: 'reply',
      value: 1,
    };

    // add the job to the queue
    await actionQueue.add('actionJob', payload);
  });

  // add afterDestroy hook to decrement the replies count of the story/reply
  Reply.afterDestroy(async reply => {
    // construct the job payload: for queueing
    const payload = {
      kind: reply.kind,
      action: 'destroy',
      hashes: {
        target: reply.parent,
      },
      action: 'reply',
      value: -1,
    };

    // add the job to the queue
    await actionQueue.add('actionJob', payload);
  });

  /**
   * @type {Model}
   * @name Like
   * @description - This model contains all the likes info
   * @property {Number} id - Unique identifier for the like
   * @property {String} kind - The kind of like: What is being liked (story or reply)
   * @property {Number} author - The user who has made the like
   * @property {String} target - The story/reply hash the like is made on
  */
  const Like = sequelize.define("likes", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kind: {
      type: Sequelize.ENUM('story', 'reply'),
      allowNull: false
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    target: {
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
        fields: ['author', 'target']
      }
    ]
  });


  // add afterCreate hook to increment the likes count of the story/reply
  Like.afterCreate(async like => {
    // construct the job payload: for queueing
    const payload = {
      kind: like.kind,
      action: 'create',
      hashes: {
        target: like.target,
      },
      action: 'like',
      value: 1,
    };
    
    // add the job to the queue
    await actionQueue.add('actionJob', payload);
  });


  // add afterDestroy hook to decrement the likes count of the story/reply
  Like.afterDestroy(async like => {
    // construct the job payload: for queueing
    const payload = {
      kind: like.kind,
      action: 'destroy',
      hashes: {
        target: like.target,
      },
      action: 'like',
      value: -1,
    };

    // add the job to the queue
    await actionQueue.add('actionJob', payload);
  });


  /**
   * @type {Model}
   * @name View
   * @description - This model contains all the Views info
   * @property {Number} id - Unique identifier for the View
   * @property {String} kind - The kind of View: What is being viewed (story, reply or topic)
   * @property {Number} author - The user who has made the View
   * @property {String} target - The story/reply hash the View is made on
  */
  const View = sequelize.define("views", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kind: {
      type: Sequelize.ENUM('story', 'reply', 'topic'),
      allowNull: false
    },
    author: {
      type: Sequelize.STRING,
      allowNull: true
    },
    target: {
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
        fields: ['author', 'item']
      }
    ]
  });

  // add afterCreate hook to increment the views count of the story, reply or topic
  View.afterCreate(async view => {
    // construct the job payload: for queueing
    const payload = {
      kind: view.kind,
      action: 'create',
      hashes: {
        target: view.target,
      },
      action: 'view',
      value: 1,
    };

    // add the job to the queue
    await actionQueue.add('actionJob', payload);
  });

  //--- Defining the associations ---//
  // User <--> Story
  User.hasMany(Story, { foreignKey: 'author', sourceKey: 'hash', as : 'authored_stories', onDelete: 'CASCADE' });
  Story.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'story_author', onDelete: 'CASCADE' });

  // User <--> Reply association
  User.hasMany(Reply, { foreignKey: 'author', sourceKey: 'hash', as: 'authored_replies', onDelete: 'CASCADE' });
  Reply.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'reply_author', onDelete: 'CASCADE' });

  // User <--> Like association
  User.hasMany(Like, { foreignKey: 'author', sourceKey: 'hasj', as: 'authored_likes', onDelete: 'CASCADE' });
  Like.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'like_author', onDelete: 'CASCADE' });

  // User <--> View association
  User.hasMany(View, { foreignKey: 'author', sourceKey: 'hash', as: 'authored_views', onDelete: 'CASCADE' });
  View.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'view_author', onDelete: 'CASCADE' });

  // Story --> Reply association
  Story.hasMany(Reply, { foreignKey: 'parent', sourceKey: 'hash', as: 'story_replies', onDelete: 'CASCADE' });
  // Reply.belongsTo(Story, { foreignKey: 'parent', as: 'parent_story', onDelete: 'CASCADE' });

  // Reply --> Reply association
  Reply.hasMany(Reply, { foreignKey: 'parent', sourceKey: 'hash', as: 'reply_replies', onDelete: 'CASCADE' });

  // Story --> Like association
  Story.hasMany(Like, { foreignKey: 'target', sourceKey: 'hash', as: 'story_likes', onDelete: 'CASCADE' });
  // Like.belongsTo(Story, { foreignKey: 'item', as: 'story_like', onDelete: 'CASCADE' });

  // Story --> View association
  Story.hasMany(View, { foreignKey: 'target', sourceKey: 'hash', as: 'story_views', onDelete: 'CASCADE' });
  // View.belongsTo(Story, { foreignKey: 'item', as: 'viewed_story', onDelete: 'CASCADE' });

  // Reply --> Like association
  Reply.hasMany(Like, { foreignKey: 'target', sourceKey: 'hash', as: 'reply_likes', onDelete: 'CASCADE' });
  // Like.belongsTo(Reply, { foreignKey: 'item', as: 'liked_reply', onDelete: 'CASCADE' });

  // Reply --> View association
  Reply.hasMany(View, { foreignKey: 'target', sourceKey: 'hash', as: 'reply_views', onDelete: 'CASCADE' });
  // View.belongsTo(Reply, { foreignKey: 'item', as: 'viewed_reply', onDelete: 'CASCADE' });

  return { Story, Reply, Like, View }
}