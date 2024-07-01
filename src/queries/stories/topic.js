// Importing the required modules, fns, configs, and utils...
const { Sequelize} = require('../../models').models;
const Op = Sequelize.Op;

// Import the helper functions
const { 
  getStoriesWhenLoggedIn, getStoriesWhenLoggedOut,
  getTopicAuthorsWhenLoggedIn, getTopicAuthorsWhenLoggedOut
} = require('./helper');


/**
 * @function findStoriesByTopic
 * @description a function that finds stories by topic in the database: 10 at a time orderd by the date created
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The stories object and error if any
*/
const findStoriesByTopic = async (reqData) => {
  try {
    // dEstructure the request data
    const { topic, user, page, limit } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the stories
    const where = { 
      published: true,
      topics: { [Op.contains]: [topic] } 
    };

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
      return { data: {
        stories: [],
        limit: limit,
        offset: offset,
        last: true,
      }, error: null };
    }

    const last = stories.length < limit;

    // create a data object
    const data = {
      stories: stories,
      limit: limit,
      offset: offset,
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
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The stories object and error if any
*/
const findRelatedStories = async (reqData) => {
  try {
    // Destructure the request data
    const { topics, user, page, limit } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // Find the stories
    const where = {
      published: true,
      topics: { [Op.contains]: topics } 
    };

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
      return { data: {
        stories: [],
        limit: limit,
        offset: offset,
        last: true,
      }, error: null };
    }

    const last = stories.length < limit;

    // create a data object
    const data = {
      stories: stories,
      limit: limit,
      offset: offset,
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
 * @function findTopicContributors
 * @description a function that finds the contributors of a topic in the database
 * @param {Object} reqData - The request data object
 * @returns {Object} data - The contributors object and error if any
 * @returns {Object} - Returns response object
*/
const findTopicContributors = async (reqData) => {
  try {
    // Destructure the request data
    const { hash, user, page, limit } = reqData;

    // Contruct offset from page and limit
    const offset = (page - 1) * limit;

    // fetch the topic authors from Topic table
    const topic = await Topic.findOne({
      attributes: ['authors', 'hash', 'slug'],
      where: { hash } 
    });

    // Check if the topic exists
    if (topic === null) {
      return { data: null, error: new Error('Topic not found!') };
    }

    // Find the stories
    const where = {
      hash: { [Op.in]: topic.authors }
    };

    const order = [['createdAt', 'DESC']];

    // initialize the people to be null
    let people = null;

    // check if user is logged in
    if (user !== null) {
      const fetchedPeople =  await getTopicAuthorsWhenLoggedIn(where, order, user, limit, offset);

      // If there is an error: throw the error
      if (fetchedPeople.error) {
        throw fetchedPeople.error;
      }

      // set the people
      people = fetchedPeople.people;  
    }
    else {
      const fetchedPeople = await getTopicAuthorsWhenLoggedOut(where, order, limit, offset);

      // If there is an error: throw the error
      if (fetchedPeople.error) {
        throw fetchedPeople.error;
      }

      // set the people
      people = fetchedPeople.people;
    }

    // Check if the people exist
    if (people === null) {
      return { data: {
        people: [],
        limit: limit,
        offset: offset,
        last: true,
      }, error: null };
    }

    const last = people.length < limit;

    // create a data object
    const data = {
      people: people,
      limit: limit,
      offset: offset,
      last: last,
    }

    // return the people
    return { data: data, error: null };
  }
  catch (error) {
    // return the error
    return { data: null, error };
  }
}


// Export the query functions
module.exports = {
  findStoriesByTopic, findRelatedStories, findTopicContributors
}