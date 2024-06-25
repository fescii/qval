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
   * @property {Boolean} published - The status of the story: published or not
   * @property {Number} author - The author of the story: hash of the author
   * @property {String} hash - The hash of the story/ usually a unique identifier generated from hash algorithms(sha256)
   * @property {String} title - The title of the story
   * @property {String} slug - The slug of the story, a unique identifier for the story
   * @property {Array} poll - The poll options of the story. an array of strings
   * @property {Array} votes - The votes of the poll per option. an array of integers
   * @property {String} content - The content of the story
   * @property {String} body - The body of the story
   * @property {Array} topics - The topics of the story. an array of strings
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
    published: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    author: {
      type: Sequelize.STRING,
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
    poll: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true
    },
    votes: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
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
  },{
    schema: 'story',
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['id', 'slug', 'hash']
      },
      {
        fields: ['kind', 'author', 'title', 'published', 'views', 'likes', 'replies']
      }
    ]
  });

   // add afterSync hook to create the search column and create the GIN index
   Story.afterSync(() => {
    // Run the raw SQL query to add the `ts` column
    sequelize.query(`ALTER TABLE story.stories ADD COLUMN IF NOT EXISTS search TSVECTOR
      GENERATED ALWAYS AS(setweight(to_tsvector('english', coalesce(title, '')), 'A') || setweight(to_tsvector('english', coalesce(slug, '')), 'B') || setweight(to_tsvector('english', coalesce(content, '')), 'C')) STORED;
    `);

    // create the GIN index for the full_search column
    sequelize.query(`CREATE INDEX IF NOT EXISTS search_story_idx ON story.stories USING GIN(search)`);
  });


  // add search property to the story model
  Story.search = async query => {
    // Combine the tsquery strings without using colon-based match types
    const tsQuery = sequelize.fn('to_tsquery', 'english', `${query}`);

    return await Story.findAll({
      attributes: ['kind', 'author', 'hash', 'title', 'slug', 'content', 'topics', 'views', 'likes', 'replies'],
      where: sequelize.where(
        sequelize.fn('to_tsvector', 'english', sequelize.fn('concat' , sequelize.col('title'), ' ', sequelize.col('content'), ' ', sequelize.col('slug'))),
        '@@',
        tsQuery,
      ),
      order: sequelize.literal(`ts_rank_cd(search, to_tsquery('english', '${query}')) DESC`)
    })
  }

  /**
   * @type {Model}
   * @name StorySection
   * @description - This model contains all the story section info
   * @property {Number} id - Unique identifier for the story section
   * @property {String} kind - The kind of story section (section, chapter, part, episode)
   * @property {Number} order - The order of the story section
   * @property {String} story - The story hash the section belongs to
   * @property {String} title - The title of the story section || can be null
   * @property {String} content - The content of the story section
  */
  const StorySection = sequelize.define("story_sections", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kind: {
      type: Sequelize.ENUM('section', 'chapter', 'part', 'episode'),
      defaultValue: 'section',
      allowNull: false
    },
    order: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    story: {
      type: Sequelize.STRING,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
  },{
    schema: 'story',
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['id']
      },
      {
        fields: ['kind', 'story', 'title']
      }
    ]
  });

  /**
   * @type {Model}
   * @name Votes
   * @description - This model contains all the poll info for a story
   * @property {Number} id - Unique identifier for the poll
   * @property {String} story - The story hash the poll belongs to
   * @property {String} author - The author of the poll
   * @property {INTEGER} option - The option of the poll
  */
  const Vote = sequelize.define("votes", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    story: {
      type: Sequelize.STRING,
      allowNull: false
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    option: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  },{
    schema: 'story',
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['id']
      },
      {
        fields: ['story', 'author', 'option']
      }
    ]
  });


  // addd afterCreate hook to increment the votes count of the story
  Vote.afterCreate(async vote => {
    // construct the job payload: for queueing
    const payload = {
      kind: 'story',
      hashes: {
        target: vote.story,
      },
      action: 'vote',
      value: vote.option,
    };

    // add the job to the queue
    await actionQueue.add('actionJob', payload);
  });


  /**
   * @type {Model}
   * @name Reply
   * @description - This model contains all the Reply info
   * @property {Number} id - Unique identifier for the Reply
   * @property {String} kind - The kind of Reply (reply to a story or reply to a reply)
   * @property {String} story - The story hash || can be null
   * @property {String} reply - The reply hash || can be null
   * @property {Number} author - The author who has made the Reply
   * @property {String} hash - The hash of the Reply/ usually a unique identifier generated from hash algorithms(sha256)
   * @property {String} content - The content of the Reply
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
    story: {
      type: Sequelize.STRING,
      allowNull: true
    },
    reply: {
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
      allowNull: false
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
        fields: ['content', 'author', 'story', 'reply']
      }
    ]
  });

  // add afterSync hook to create the search column and create the GIN index
  Reply.afterSync(() => {
    // Run the raw SQL query to add the `ts` column
    sequelize.query(`ALTER TABLE story.replies ADD COLUMN IF NOT EXISTS search TSVECTOR
      GENERATED ALWAYS AS(setweight(to_tsvector('english', coalesce(content, '')), 'A')) STORED;
    `);

    // create the GIN index for the full_search column
    sequelize.query(`CREATE INDEX IF NOT EXISTS search_reply_idx ON story.replies USING GIN(search)`);
  });

  // add search property to the reply model
  Reply.search = async query => {
    // Combine the tsquery strings without using colon-based match types
    const tsQuery = sequelize.fn('to_tsquery', 'english', `${query}`);
    
    return await Reply.findAll({
      attributes: ['kind', 'author', 'story', 'reply', 'hash', 'content', 'views', 'likes', 'replies'],
      where: sequelize.where(
        sequelize.fn('to_tsvector', 'english', sequelize.fn('concat' , sequelize.col('content'))),
        '@@',
        tsQuery,
      ),
      order: sequelize.literal(`ts_rank_cd(search, to_tsquery('english', '${query}')) DESC`)
    })
  }

  // add afterDestroy hook to decrement the replies count of the story/reply
  Reply.afterDestroy(async reply => {
    // construct the job payload: for queueing
    const payload = {
      kind: reply.kind,
      hashes: {
        target: reply.reply !== null ? reply.reply : reply.story,
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
    story: {
      type: Sequelize.STRING,
      allowNull: true
    },
    reply: {
      type: Sequelize.STRING,
      allowNull: true
    }
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
        fields: ['author', 'story', 'reply']
      }
    ]
  });


  // add afterCreate hook to increment the likes count of the story/reply
  Like.afterCreate(async like => {
    // construct the job payload: for queueing
    const payload = {
      kind: like.kind,
      hashes: {
        target: like.reply !== null ? like.reply : like.story,
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
      hashes: {
        target: like.reply !== null ? like.reply : like.story,
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
        fields: ['author', 'target']
      }
    ]
  });

  // add afterCreate hook to increment the views count of the story, reply or topic
  View.afterCreate(async view => {
    // construct the job payload: for queueing
    const payload = {
      kind: view.kind,
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

  // Story <--> StorySection
  Story.hasMany(StorySection, { foreignKey: 'story', sourceKey: 'hash', as: 'story_sections', onDelete: 'CASCADE' });
  StorySection.belongsTo(Story, { foreignKey: 'story', targetKey: 'hash', as: 'section_story', onDelete: 'CASCADE' });

  // Story <--> Vote
  Story.hasMany(Vote, { foreignKey: 'story', sourceKey: 'hash', as: 'story_votes', onDelete: 'CASCADE' });
  Vote.belongsTo(Story, { foreignKey: 'story', targetKey: 'hash', as: 'voted_story', onDelete: 'CASCADE' });

  // User <--> Vote
  User.hasMany(Vote, { foreignKey: 'author', sourceKey: 'hash', as: 'authored_votes', onDelete: 'CASCADE' });
  Vote.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'vote_author', onDelete: 'CASCADE' });

  // User <--> Reply association
  User.hasMany(Reply, { foreignKey: 'author', sourceKey: 'hash', as: 'authored_replies', onDelete: 'CASCADE' });
  Reply.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'reply_author', onDelete: 'CASCADE' });

  // User <--> Like association
  User.hasMany(Like, { foreignKey: 'author', sourceKey: 'hash', as: 'authored_likes', onDelete: 'CASCADE' });
  Like.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'like_author', onDelete: 'CASCADE' });

  // Story --> Reply association
  Story.hasMany(Reply, {foreignKey: 'story', sourceKey: 'hash', as: 'story_replies', onDelete: 'CASCADE'})
  Reply.belongsTo(Story, {foreignKey: 'story', targetKey: 'hash', as: 'reply_story', onDelete: 'CASCADE'})

  // Reply --> Reply association
  Reply.hasMany(Reply, {foreignKey: 'reply', sourceKey: 'hash', as: 'reply_replies', onDelete: 'CASCADE'});
  Reply.belongsTo(Reply, { foreignKey: 'reply', targetKey: 'hash', as: 'reply_reply', onDelete: 'CASCADE'});

  // Story --> Like association
  Story.hasMany(Like, { foreignKey: 'story', sourceKey: 'hash', as: 'story_likes', onDelete: 'CASCADE' });
  Like.belongsTo(Story, { foreignKey: 'story', targetKey: 'hash', as: 'story_like', onDelete: 'CASCADE' });

  // Reply --> Like association
  Reply.hasMany(Like, { foreignKey: 'reply', sourceKey: 'hash', as: 'reply_likes', onDelete: 'CASCADE' });
  Like.belongsTo(Reply, { foreignKey: 'reply', targetKey: 'hash',as: 'liked_reply', onDelete: 'CASCADE' });

  return { Story, Reply, Like, View, StorySection, Vote }
}