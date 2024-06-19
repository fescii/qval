// Import action Queue from the bull module
const { actionQueue } = require('../bull');

/**
 * @name - topic.model
 * @module models/topic.model
 * @description - This file contains the model for the topic module / schema
 * @param {Object} User - User model
 * @param {Object} sequelize - Sequelize object
 * @param {Object} Sequelize - Sequelize module
 * @returns {Object} - Returns object containing all the models
 */
module.exports = (User, Story, sequelize, Sequelize) => {

  /**
   * @type {Model}
   * @name Topic
   * @description - This model contains all the topic info
   * @property {Number} id - Unique identifier for the topic
   * @property {String} author - The hash of the user who created the topic
   * @property {String} hash - Unique hash for the topic, usually generated by the hash algorithms
   * @property {String} name - Name of the topic
   * @property {String} slug - Unique slug for the topic
   * @property {String} summery - Summery of the topic in text
   * @property {Number} followers - Number of followers the topic has
   * @property {Number} subscribers - Number of subscribers to the topic
   * @property {Number} stories - Number of stories tagged to the topic
   * @property {Number} views - Number of views the topic has
  */
  const Topic = sequelize.define("topics", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      followers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      subscribers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      stories: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true
      },

      // add tsvector column for full text search: for columns(name, slug)
      name_slug_search: {
        type: Sequelize.TSVECTOR,
        allowNull: true,
        get(){
          return sequelize.fn('to_tsvector', 'english', this.getDataValue('name') + ' ' + this.getDataValue('slug'));
        }
      },

      // add tsvector column for full text search: for columns(name, slug, summery)
      full_search: {
        type: Sequelize.TSVECTOR,
        allowNull: true,
        get(){
          return sequelize.fn('to_tsvector', 'english', this.getDataValue('name') + ' ' + this.getDataValue('slug') + ' ' + this.getDataValue('summary'));
        }
      }
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
          fields: ['name', 'author']
        }
      ]
    });

  // add afterSync hook to update the name_slug_search: and full_search column and create the GIN index
  Topic.afterSync(() => {
    // create the GIN index for the name_slug_search column
    sequelize.query(`CREATE INDEX IF NOT EXISTS name_slug_search_idx ON topic.topics USING GIN(name_slug_search)`);

    // create the GIN index for the full_search column
    sequelize.query(`CREATE INDEX IF NOT EXISTS full_search_idx ON topic.topics USING GIN(full_search)`);
  });

  // update vector columns before saving
  Topic.beforeSave(async topic => {
    // update the name_slug_search column
    topic.name_slug_search = sequelize.fn('to_tsvector', 'english', topic.name + ' ' + topic.slug);

    // update the full_search column
    topic.full_search = sequelize.fn('to_tsvector', 'english', topic.name + ' ' + topic.slug + ' ' + topic.summery);


    // update the name_slug_search column
    // await sequelize.query(`UPDATE topic.topics SET name_slug_search = to_tsvector('english', name || ' ' || slug) WHERE id = ${topic.id}`);

    // // update the full search column
    // await sequelize.query(`UPDATE topic.topics SET full_search = to_tsvector('english', name || ' ' || slug || ' ' || coalesce(summery, '')) WHERE id = ${topic.id}`);
  });

  // add prototype to search: name_slug_search
  Topic.search = async query => {
    // search the query in the name_slug_search column
    // refine the query: make the query to match containing, starting or ending with the query
    // return await sequelize.query(`SELECT * FROM topic.topics WHERE name_slug_search @@ ${query}`, {replacement: {query: `${query}:*`}, model: Topic });

    return await Topic.findAll({
      where: sequelize.where(
        sequelize.fn('to_tsvector', 'english',  sequelize.fn('concat', sequelize.col('name'), ' ', sequelize.col('slug'))),
        '@@', query
      ),
      // order: sequelize.literal(`ts_rank_cd(name_slug_search, to_tsquery('english', '${query}')) DESC`)
    })
  }

  // add prototype to search: full_search
  Topic.fullSearch = async query => {
    // search the query in the full_search column: adding score to the result
    return await sequelize.query(`SELECT *, ts_rank_cd(full_search, to_tsquery('english', '${query}')) as score FROM topic.topics WHERE full_search @@ to_tsquery('english', '${query}') ORDER BY score DESC`,{replacements: [query], model: Topic });
  }

  /**
   * @type {Model}
   * @name TopicSection
   * @description - This model contains all the sections of a topic
   * @property {Number} id - Unique identifier for the section
   * @property {String} topic - Topic hash, A topic model instance hash where the section belongs
   * @property {Number} order - The order of the section in the topic
   * @property {String} title - Title of the section
   * @property {String} content - Content of the section
   * @property {Array} authors - Authors of the section
  */
  const TopicSection = sequelize.define("sections", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    topic: {
      type: Sequelize.STRING,
      allowNull: false
    },
    order: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    authors: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true
    },
  },
  {
    schema: 'topic',
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['id',]
      },
      {
        fields: ['topic', 'order']
      }
    ]
  });

  /**
   * @type {Model}
   * @name Draft
   * @description - This model contains all the drafts of the sections of a topic
   * @property {Number} id - Unique identifier for the draft
   * @property {String} kind - The kind of draft, could be a new section or an update
   * @property {Number} section - The section id, A section model instance id where the draft belongs and can be null
   * @property {Number} order - The order of the section in the topic: Is null if it's a new section
   * @property {String} title - Title of the draft
   * @property {String} content - Content of the draft
   * @property {String} author - Author of the draft
   * @property {Boolean} approved - Approval status of the draft
  */
  const Draft = sequelize.define("drafts", {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    topic: {
      type: Sequelize.STRING,
      allowNull: false
    },
    kind: {
      type: Sequelize.ENUM('new', 'update'),
      allowNull: false
    },
    section: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    order: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
    approved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
        fields: ['author', 'kind', 'topic']
      }
    ]
  });


  /**
   * @type {Model}
   * @name Tagged
   * @description - This model contains all the items tagged to a topic
   * @property {Number} id - Unique identifier for the tagged
   * @property {String} topic - Topic hash, A topic model instance hash where the item is tagged
   * @property {String} story - Target hash, A target model instance hash where the topic is tagged
  */
  const Tagged = sequelize.define("tagged", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      topic: {
        type: Sequelize.STRING,
        allowNull: false
      },
      story: {
        type: Sequelize.STRING,
        allowNull: false
      },
    },
    {
      // timestamps: false,
      schema: 'topic',
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ['id']
        },
        {
          fields: ['topic', 'story']
        }
      ]
    });

  /**
   * @type {Model}
   * @name Subscribe
   * @description - This model contains all the subscribers to a topic
   * @property {Number} id - Unique identifier for the subscriber record
   * @property {Number} author - Author who subscribed to the topic
   * @property {String} topic - The hash of the topic being subscribed to
  */
  const Subscribe = sequelize.define("subscribers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false
      },
      topic: {
        type: Sequelize.STRING,
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

    // add a hook to the Subscribe model to add a job to the queue
    Subscribe.afterCreate(async subscribe => {
      // construct the job payload
      const payload = {
        kind: 'topic',
        hashes: {
          topic: subscribe.topic,
        },
        action: 'subscribe',
        value: 1
      };

      // add the job to the queue
      actionQueue.add(payload);
    });

    // add a hook to the Subscribe model to add a job to the queue
    Subscribe.afterDestroy(async subscribe => {
      // construct the job payload
      const payload = {
        kind: 'topic',
        hashes: {
          topic: subscribe.topic,
        },
        action: 'subscribe',
        value: -1
      };

      // add the job to the queue
      actionQueue.add(payload);
    });


    /**
     * @type {Model}
     * @name Follow
     * @description - This model contains all the followers of a topic
     * @property {Number} id - Unique identifier for the follower record
     * @property {String} topic - The hash of the topic being followed
     * @property {String} author - The hash of the user following the topic.
    */
    const Follow = sequelize.define("followers", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      topic: {
        type: Sequelize.STRING,
        allowNull: false
      },
      author: {
        type: Sequelize.STRING,
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

    // add a hook to the Follow model to add a job to the queue
    Follow.afterCreate(async follow => {
      // construct the job payload
      const payload = {
        kind: 'topic',
        hashes: {
          topic: follow.topic,
        },
        action: 'follow',
        value: 1
      };

      // add the job to the queue
      actionQueue.add(payload);
    });

    // add a hook to the Follow model to add a job to the queue
    Follow.afterDestroy(async follow => {
      // construct the job payload
      const payload = {
        kind: 'topic',
        hashes: {
          topic: follow.topic,
        },
        action: 'follow',
        value: -1
      };

      // add the job to the queue
      actionQueue.add(payload);
    });

  // Defining the associations on the User and Topic models
  User.hasMany(Topic, { foreignKey: 'author', sourceKey: 'hash' , as : 'user_topics', onDelete: 'CASCADE' });
  Topic.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'topic_author', onDelete: 'CASCADE' });

  // Defining the associations on the Topic and Tagged models
  Topic.hasMany(Tagged, { foreignKey: 'topic', sourceKey: 'hash', as : 'topic_tags', onDelete: 'CASCADE' });
  Tagged.belongsTo(Topic, { foreignKey: 'topic', targetKey: 'hash', as: 'tagged_topic', onDelete: 'CASCADE' });

  // Defining the associations on the Story and Tagged models
  Story.hasMany(Tagged, { foreignKey: 'story', sourceKey: 'hash', as : 'story_tags', onDelete: 'CASCADE' });
  Tagged.belongsTo(Story, { foreignKey: 'story', targetKey: 'hash', as: 'tagged_story', onDelete: 'CASCADE' });

  // Defining the associations on the Topic and Subscribe models
  Topic.hasMany(Subscribe, { foreignKey: 'topic', sourceKey: 'hash', as : 'topic_subscribers', onDelete: 'CASCADE' });
  Subscribe.belongsTo(Topic, { foreignKey: 'topic', targetKey: 'hash', as: 'subscribed_topic', onDelete: 'CASCADE' });

  // Defining the associations on the User and Subscribe models
  User.hasMany(Subscribe, { foreignKey: 'author', sourceKey: 'hash', as : 'user_subscriptions', onDelete: 'CASCADE' });
  Subscribe.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'subscribed_user', onDelete: 'CASCADE' });

  // Defining the associations on the Topic and Follow models
  Topic.hasMany(Follow, { foreignKey: 'topic', sourceKey: 'hash', as : 'topic_followers', onDelete: 'CASCADE' });
  Follow.belongsTo(Topic, { foreignKey: 'topic', targetKey: 'hash', as: 'followed_topic', onDelete: 'CASCADE' });

  // Defining the associations on the User and Follow models
  User.hasMany(Follow, { foreignKey: 'author', sourceKey: 'hash', as : 'user_follows', onDelete: 'CASCADE' });
  Follow.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'followed_user', onDelete: 'CASCADE' });

  // Defining the associations on the Topic and TopicSection models
  Topic.hasMany(TopicSection, { foreignKey: 'topic', sourceKey: 'hash', as : 'topic_sections', onDelete: 'CASCADE' });
  TopicSection.belongsTo(Topic, { foreignKey: 'topic', targetKey: 'hash', as: 'section_topic', onDelete: 'CASCADE' });

  // Defining the associations on the Topic and Draft models
  Topic.hasMany(Draft, { foreignKey: 'topic', sourceKey: 'hash', as : 'topic_drafts', onDelete: 'CASCADE' });
  Draft.belongsTo(Topic, { foreignKey: 'topic', targetKey: 'hash', as: 'draft_topic', onDelete: 'CASCADE' });

  // Defining the associations on the TopicSection and Draft models
  TopicSection.hasMany(Draft, { foreignKey: 'section', sourceKey: 'id', as : 'section_drafts', onDelete: 'CASCADE' });
  Draft.belongsTo(TopicSection, { foreignKey: 'section', targetKey: 'id', as: 'draft_section', onDelete: 'CASCADE' });

  // Defining the associations on the User and Draft models
  User.hasMany(Draft, { foreignKey: 'author', sourceKey: 'hash', as : 'user_drafts', onDelete: 'CASCADE' });
  Draft.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'draft_author', onDelete: 'CASCADE' });

  // Returning the models
  return { Topic, Tagged, Subscribe, Follow, TopicSection, Draft };
}