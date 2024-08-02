const { hashConfig} = require('../../configs');
const { sequelize, Sequelize, Topic, Section, TopicSection, Role, User } = require('../../models').models;
const { RoleBase } = require('../../configs').platformConfig;
const Op = Sequelize.Op;

// Imports for gen_hash
const { gen_hash } = require("../../wasm");
const  { hash_secret } = require("../../configs").envConfig;

/**
 * @function addTopic
 * @description Query to add a new topic
 * @param {String} user - The hash of the user who's creating the topic
 * @param {Object} data - The data of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const addTopic = async (user, data) => {
  // Start a new transaction
  const transaction = await sequelize.transaction();

  try {
    // add author to the data object
    data.author = user.hash;
  
    // Trying to create a topic to the database
    const topic = await Topic.create(data, {transaction});

    // Generate a hash for the topic created
    const {
      hash,
      error
    } = await gen_hash(hash_secret, hashConfig.topic, topic.id.toString());

    // If there is an error, throw an error
    if (error) {
      throw new Error(error);
    }

    // Update the topic with the hash
    await topic.update({ hash }, {transaction});

    // Create a section for the topic created
    const section = await Section.create({
      identity: topic.hash,
      target: topic.id,
      name: topic.name,
      description: `This is a section for the topic - ${topic.name}`
    }, {transaction});

    // Create a role for the user who created the topic
    const role = await Role.create({
      section: section.identity,
      user: user.id,
      base: RoleBase.Owner,
      name: `This is a role for section - ${topic.name}`,
      privileges: {
        'action': ["create", "read", "update", "delete"],
        'authors': ["create", "read", "update", "delete"],
        'sections': ["create", "update", "assign", "remove", "approve", "reject"],
      },
      expired: false
    }, {transaction});

    // Commit the transaction
    await transaction.commit();

    // On success return data
    return { 
      topic: {
        author: topic.author,
        hash: topic.hash,
        name: topic.name,
        slug: topic.slug,
        summary: topic.summary,
        created: topic.createdAt,
        updated: topic.updatedAt
      },
      error: null
    }
  } catch (error) {
    // Rollback the transaction
    await transaction.rollback();
    return { topic: null, error: error}
  }
}

/**
 * @function checkIfTopicExists
 * @description Query to check if a topic exists
 * @param {String} name - The name of the topic
 * @param {String} slug - The slug of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const checkIfTopicExists = async (name, slug) => {
  // Check if a topic exists
  try {
    const topic = await Topic.findOne({
      where: {
        [Op.or]: [
          {name: name},
          {slug: slug}
        ]
      }
    });

    // If a topic exists, return the topic
    if (topic) {
      // console.log(topic)
      // On success return data
      return {
        topic: {
          author: topic.author,
          hash: topic.hash,
          name: topic.name,
          slug: topic.slug,
          summary: topic.summary
        }, 
        error: null
      }
    }
    else {
      // If a topic doesn't exist, returns both null
      return { topic: null, error: null}
    }
  }
  catch (error) {
    return { topic: null, error: error}
  }
}

/**
 * @function editTopic
 * @description Query to edit a topic
 * @param {String} hash - The hash of the topic
 * @param {Object} data - The data of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const editTopic = async (hash, data) => {
  // Start a new transaction
  const transaction = await sequelize.transaction();

  try {
    const topic = await Topic.findOne({
      where: {
        hash: hash
      }
    });

    // If a topic exists, update the topic
    if (topic) {
      await topic.update(data, {transaction});

      await transaction.commit();

      return {
        topic: {
          author: topic.author,
          hash: topic.hash,
          name: topic.name,
          slug: topic.slug,
          summary: topic.summary
        }, 
        error: null
      }
    }
    else {
      // If a topic doesn't exist, returns both null
      return { topic: null, error: null}
    }
  }
  catch (error) {
    await transaction.rollback();
    return { topic: null, error: error}
  }
}

/**
 * @function findTopic
 * @description Query to find a topic
 * @param {String} hash - The hash of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const findTopic = async hash => {
  // Check if a topic exists
  try {
    const topic = await Topic.findOne({
      where: {
        hash: hash
      }
    });

    // If a topic exists, return the topic
    if (topic) {
      return {
        topic: topic, 
        error: null
      }
    }
    else {
      // If a topic doesn't exist, returns both null
      return { topic: null, error: null}
    }
  }
  catch (error) {
    return { topic: null, error: error}
  }
}

/**
 * @function findTopicBySlug
 * @description Query to find a topic by slug
 * @param {String} slug - The slug of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const findTopicBySlug = async (slug) => {
  // Check if a topic exists
  try {
    const topic = await Topic.findOne({
      where: {
        slug: slug
      }
    });

    // if topic doesn't exist
    if (!topic) {
      return { topic: null, error: null}
    }

    // If topic exists, return the topic
    return {topic: topic, error: null}
  }
  catch (error) {
    return { topic: null, error: error}
  }
}


/**
 * function findTopicBySlugOrHash
 * @description Query to find a topic by slug or hash
 * @param {String} query - The query of the topic
 * @param {String} user - The user hash
 * @returns {Object} - The topic object or null, and the error if any
*/
const findTopicBySlugOrHash = async (query, user) => {
  // console.log('User:', user, 'Query:', query, 'Find Topic By Slug Or Hash')
  try {
    // check if user is logged in
    if (user !== null) {
      return await findTopicWhenLoggedIn(query, user.toUpperCase());
    }
    else {
      return await findTopicWhenLoggedOut(query);
    }
  }
  catch (error) {
    return { topic: null, error: error}
  }
}

/**
 * @function findTopicWhenLoggedIn
 * @description Query to find a topic when logged in
 * @param {String} query - The query of the topic
 * @param {String} user - The user hash
 * @returns {Object} - The topic object or null, and the error if any
*/
const findTopicWhenLoggedIn = async (query, user) => {
  const topic = await Topic.findOne({
    // attributes including a subquery to check whether the user is following the topic and is subscribed to the topic
    attributes: ['author', 'hash', 'name', 'slug', 'summary', 'followers', 'subscribers', 'stories', 'views', 
      [
        Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM "topic"."followers" AS t_followers WHERE t_followers.topic = topics.hash AND t_followers.author = '${user}')`)),
        'is_following'
      ],
      [
        Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM "topic"."subscribers" AS t_subscribers WHERE t_subscribers.topic = topics.hash AND t_subscribers.author = '${user}')`)),
        'is_subscribed'
      ]
    ],
    where: {
      [Op.or]: [
        { slug: query },
        { hash: query.toUpperCase() }
      ]
    },
    include: [
      {
        model: User,
        as: 'topic_author',
        attributes:['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'verified', 'replies', 'email', 'contact',
          [
            Sequelize.fn('EXISTS', Sequelize.literal(`(SELECT 1 FROM account.connects WHERE connects.to = topic_author.hash AND connects.from = '${user}')`)),
            'is_following'
          ]
        ],
      },
      // include the sections of the topic
      {
        model: TopicSection,
        as: 'topic_sections',
        attributes: ['order', 'topic', 'title', 'content'],
        order: [['order', 'ASC']],
      }
    ]
  });

  // if topic doesn't exist
  if (!topic) {
    return { topic: null, error: null }
  }

  const data = topic.dataValues;

  // add the topic author to the data object
  data.topic_author = topic.topic_author.dataValues;

  // add the sections to the data object
  data.topic_sections = mapFields(topic.topic_sections, data.hash);
  
  data.you = data.topic_author.hash === user;

  // If topic exists, return the topic
  return { topic: data, error: null }
}


/**
 * @function findTopicWhenLoggedOut
 * @description Query to find a topic when logged out
 * @param {String} query - The query of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const findTopicWhenLoggedOut = async (query) => {
  const topic = await Topic.findOne({
    attributes: ['author', 'hash', 'name', 'slug', 'summary', 'followers', 'subscribers', 'stories', 'views', 'createdAt'],
    where: {
      [Op.or]: [
        {slug: query},
        {hash: query.toUpperCase()}
      ]
    },
    include: [
      {
        model: User,
        as: 'topic_author',
        attributes: ['hash', 'bio', 'name', 'picture', 'followers', 'following', 'stories', 'createdAt', 'verified', 'replies', 'email', 'contact'],
      },
      // include the sections of the topic
      {
        model: TopicSection,
        as: 'topic_sections',
        attributes: ['order', 'topic', 'title', 'content'],
        order: [['order', 'ASC']],
      }
    ]
  });

  // if topic doesn't exist
  if (!topic) {
    return { topic: null, error: null}
  }

  // add the topic sections to the data object
  topic.topic_sections = mapFields(topic.topic_sections, topic.hash);

  // If topic exists, return the topic
  return {topic: topic, error: null}
}

/**
 * @function findTopicsByQuery
 * @description Query to finding topics by query: using vector search for name or slug
 * @param {String} query - The query of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const findTopicsByQuery = async (query) => {
  // Check if a topic exists
  try {
    // trim the query
    query = query.trim();

    // refine the query: make the query to match containing, starting or ending with the query
    query = query.split(' ').map((q) => `${q}:*`).join(' | ');
    
    // build the query(vector search)
    const topics = await Topic.search(query);

    // if no topics found
    if (topics.length < 1) {
      return {topics: null, error: null}
    }

    // If topics exist, return the topics
    return { topics: topics, error: null}
  }
  catch (error) {
    return { topics: null, error: error}
  }
}

const mapFields = (data, hash) => {
  if (data.length <= 0) {
    return /*html*/`
      <div class="empty">
        <p>The topic has no information yet. You can contribute to this topic by adding relevent information about the topic.</p>
        <a href="/t/${hash}/contribute" class="button">Contribute</a>
      </div>
    `;
  }
  else {
    const html = data.map(section => {
      const title = section.title !== null ? `<h2 class="title">${section.title}</h2>` : '';
      return /*html*/`
        <div class="section" order="${section.order}" id="section${section.order}">
          ${title}
          ${section.content}
        </div>
      `
    }).join('');

    const last = /*html*/`
      <div class="last">
        <p>Do you have more information about this topic? You can contribute to this topic by adding or editing information.</p>
        <a href="/t/${hash}/contribute" class="button">Contribute</a>
      </div>
    `
    return html + last;
  }
}

/**
 * @function removeTopic
 * @description Query to remove a topic
 * @param {String} hash - The hash of the topic
 * @returns {Object} - The topic object or null, and the error if any
*/
const removeTopic = async (hash) => {
  // Check if a topic exists
  try {
    const result = await Topic.destroy({
      where: {
        hash: hash
      }
    });

    // check if the topic was destroyed
    if (result === 1) {
      return { deleted: true, error: null };
    }
    else {
      return { deleted: false, error: null };
    }
  }
  catch (error) {
    return { deleted: false, error: error}
  }
}

// Export the query functions
module.exports = {
  addTopic, checkIfTopicExists, editTopic,
  findTopic, removeTopic, findTopicsByQuery,
  findTopicBySlug, findTopicBySlugOrHash
}