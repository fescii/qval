// Importing the required modules, fns, configs, and utils...
const { hashConfig} = require('../../configs');
const { sequelize, Sequelize, Section, Story, Role, User } = require('../../models').models;
const { RoleBase } = require('../../configs').platformConfig;
const Op = Sequelize.Op;

// Imports for gen_hash
const { gen_hash } = require("../../wasm");
const  { hash_secret } = require("../../configs").envConfig;


const { 
  findStoryWhenLoggedIn, findStoryWhenLoggedOut, getStoriesWhenLoggedIn, getStoriesWhenLoggedOut
} = require('./helper');


/**
 * @function addStory
 * @description a function that adds a new story to the database
 * @param {Object} user - The user object(id, email, hash)
 * @param {Object} data - The story data object
 * @returns {Object} data - The added story object and error if any
*/
const addStory = async (user, data) => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // add author to the data object
    data.author = user.hash;

    // Create the story
    const story = await Story.create(data, { transaction: t });

    // Generate a hash for the story created
    const {
      hash,
      error
    } = await gen_hash(hash_secret, hashConfig.story, story.id.toString());

    // Check if there was an error generating the hash
    if (error) {
      // Throw the error
      throw error;
    }

    // Update the story with the hash
    await story.update({ hash }, { transaction: t });

    // Create a section for the story created
    const section = await Section.create({
      identity: story.hash,
      target: story.id,
      name: `Story - ${story.hash}`,
      description: `This is a section for the story - ${story.hash}`
    }, {transaction: t});

    // Create a role for the user who created the story
    await Role.create({
      section: section.identity,
      user: user.id,
      base: RoleBase.Owner,
      name: `This is a role for section - ${section.name}`,
      privileges: {
        'action': ["create", "read", "update", "delete"],
        'authors': ["create", "read", "update", "delete"],
        'sections': ["create", "update", "assign", "remove", "approve", "reject"],
        'replies': ["create", "read", "update", "delete"],
      },
      expired: false
    }, {transaction: t});

    // Commit the transaction
    await t.commit();

    // return the story
    return { 
      story: {
        kind: story.kind,
        author: story.author,
        hash: story.hash,
        title: story.title,
        content: story.content,
        slug: story.slug,
        topics: story.topics,
        poll: story.poll,
        votes: story.votes,
        views: story.views,
        replies: story.replies,
        likes: story.likes,
      }, 
      error: null 
    };
  }
  catch (error) {
    // Rollback the transaction
    await t.rollback();

    // return the error
    return { story: null, error };
  }
}

/**
 * @function checkIfStoryExists
 * @description a function that checks if a story exists in the database: using slug
 * @param {String} slug - The story slug
 * @returns {Object} data - The story object and error if any
*/
const checkIfStoryExists = async slug => {
  try {
    // Find the story
    const story = await Story.findOne({ where: { slug } });

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    // return the story
    return { 
      story: {
        kind: story.kind,
        author: story.author,
        hash: story.hash,
        title: story.title,
        content: story.content,
        slug: story.slug,
        topics: story.topics,
        poll: story.poll,
        votes: story.votes,
        views: story.views,
        replies: story.replies,
        likes: story.likes,
      }, 
      error: null 
    };
  }
  catch (error) {
    // return the error
    return { story: null, error };
  }
}

/**
 * @function findStory
 * @description a function that finds a story in the database: using hash
 * @param {String} hash - The story hash
 * @returns {Object} data - The story object and error if any
*/
const findStory = async hash => {
  try {
    // Find the story
    const story = await Story.findOne({ where: { hash } });

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    // return the story
    return { 
      story: {
        kind: story.kind,
        author: story.author,
        hash: story.hash,
        title: story.title,
        content: story.content,
        slug: story.slug,
        topics: story.topics,
        poll: story.poll,
        votes: story.votes,
        views: story.views,
        replies: story.replies,
        likes: story.likes,
      }, 
      error: null 
    };

  }
  catch (error) {
    // return the error
    return { story: null, error };
  }
}

/**
 * @function updateStory
 * @description a function that updates a story in the database
 * @param {Object} data - The story data object
 * @returns {Object} data - The updated story object and error if any
*/
const updateStory = async data => {
  // start a transaction
  const t = await sequelize.transaction();
  try {
    // Find the story
    const story = await Story.findOne({ where: { hash: data.hash } });

    // Check if the story exists
    if (!story) {
      return { story: null, error: null };
    }

    // Update the story with the new data: content
    await story.update({content: data.content}, { transaction: t });

    // Commit the transaction
    await t.commit();

    // return only the updated fields
    return { 
      story: {
        content: story.content
      },
      error: null
    }
  }
  catch (error) {
    // Rollback the transaction
    await t.rollback();

    // return the error
    return { story: null, error };
  }
}

/**
 * function findStoryBySlugOrHash
 * @description Query to find a topic by slug or hash
 * @param {String} query - The query of the topic
 * @param {String} user - The user hash
 * @returns {Object} - The topic object or null, and the error if any
*/
const findStoryBySlugOrHash = async (query, user) => {
  // console.log('User:', user, 'Query:', query, 'Find Topic By Slug Or Hash')
  try {
    // check if user is logged in
    if (user !== null) {
      return await findStoryWhenLoggedIn(query, user.toUpperCase());
    }
    else {
      return await findStoryWhenLoggedOut(query);
    }
  }
  catch (error) {
    return { topic: null, error: error}
  }
}


/**
 * @function findStoriesByTopic
 * @description a function that finds stories by topic in the database: 10 at a time orderd by the date created
 * @param {String} topic - The topic slug
 * @param {String} user - The user hash: the current user
 * @param {Number} totalStories - The total number of stories the user has published
 * @param {Number} limit - The limit for pagination: default 10
 * @param {Number} page - The current page number
 * @returns {Object} data - The stories object and error if any
*/
const findStoriesByTopic = async (topic, user, totalStories, limit=10) => {
  try {
    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // check if stories is less than the limit + offset
    if (totalStories < limit + offset) {
      limit = totalStories - offset;
    }

    // Find the stories
    const where = { topics: { [Op.contains]: [topic] } };
    const order = [['createdAt', 'DESC']];

    // initialize the stories to be null
    let stories = null;

    // check if user is logged in
    if (user !== null) {
      const fetchedStories =  await getStoriesWhenLoggedIn(where, order, user, limit, offset);

      // If there is an error: throw the error
      if (fetchedStories.error) {
        throw fetchedStories.error;
      }

      // set the stories
      stories = fetchedStories.stories;  
    }
    else {
      const fetchedStories = await getStoriesWhenLoggedOut(where, order, limit, offset);

      // If there is an error: throw the error
      if (fetchedStories.error) {
        throw fetchedStories.error;
      }

      // set the stories
      stories = fetchedStories.stories;
    }

    // Check if the stories exist
    if (stories === null) {
      return { stories: null, error: null };
    }

    // calculate the total number of pages
    const totalPages = Math.ceil(stories / limit);

    const last = page === totalPages;

    // create a data object
    const data = {
      stories: strories,
      limit: limit,
      offset: offset,
      pages: totalPages,
      last: last,
    }

    // return the stories
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}

/**
 * @function findRelatedStories
 * @description a function that finds stories by topic in the database: 10 at a time orderd by the date created
 * @param {Array} topics - The topic slugs
 * @param {String} user - The user hash: the current user
 * @param {Number} totalStories - The total number of stories the user has published
 * @param {Number} limit - The limit for pagination: default 10
 * @param {Number} page - The current page number
 * @returns {Object} data - The stories object and error if any
*/
const findRelatedStories = async (topics, user, totalStories, limit=10) => {
  try {
    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // check if stories is less than the limit + offset
    if (totalStories < limit + offset) {
      limit = totalStories - offset;
    }

    // Find the stories
    const where = { topics: { [Op.contains]: topics } };
    const order = [['createdAt', 'DESC']];

    // initialize the stories to be null
    let stories = null;

    // check if user is logged in
    if (user !== null) {
      const fetchedStories =  await getStoriesWhenLoggedIn(where, order, user, limit, offset);

      // If there is an error: throw the error
      if (fetchedStories.error) {
        throw fetchedStories.error;
      }

      // set the stories
      stories = fetchedStories.stories;  
    }
    else {
      const fetchedStories = await getStoriesWhenLoggedOut(where, order, limit, offset);

      // If there is an error: throw the error
      if (fetchedStories.error) {
        throw fetchedStories.error;
      }

      // set the stories
      stories = fetchedStories.stories;
    }

    // Check if the stories exist
    if (stories === null) {
      return { stories: null, error: null };
    }

    // calculate the total number of pages
    const totalPages = Math.ceil(stories / limit);

    const last = page === totalPages;

    // create a data object
    const data = {
      stories: strories,
      limit: limit,
      offset: offset,
      pages: totalPages,
      last: last,
    }

    // return the stories
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}

/**
 * @function findStoriesByQuery
 * @description Query to finding story by query: using vector search 
 * @param {String} query - The query of the topic
 * @returns {Object} - The stories object or null, and the error if any
*/
const findStoriesByQuery = async query => {
  try {
    // trim the query
    query = query.trim();

    // refine the query: make the query to match containing, starting or ending with the query
    query = query.split(' ').map((q) => `${q}:*`).join(' | ');
    
    // build the query(vector search)
    const stories = await Story.search(query);

    // if no stories found
    if (stories.length < 1) {
      return {stories: null, error: null}
    }

    // If stories exist, return the stories
    return { stories: stories, error: null}
  }
  catch (error) {
    return { stories: null, error: error}
  }
}

/**
 * @function removeStory
 * @description a function that removes a story from the database
 * @param {String} hash - The story hash
 * @returns {Object} data - The removed true or false and error if any
*/
const removeStory = async hash => {
  try {
    // Destroy the story
    const result = await Story.destroy({ where: { hash } });

    // Check if the story was removed
    if (result === 1) {
      return { deleted: true, error: null };
    }
    else {
      return { deleted: false, error: null };
    }
  }
  catch (error) {
    return { deleted: false, error };
  }
}

// Export the module
module.exports = {
  addStory, checkIfStoryExists,
  findStory, updateStory, findRelatedStories,
  findStoryBySlugOrHash, findStoriesByTopic,
  removeStory, findStoriesByQuery
};