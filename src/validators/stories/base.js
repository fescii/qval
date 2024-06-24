// Import sanitizeUtil from src/utils/sanitize.util.js
const sanitizeInput = require('../../utils').sanitizeUtil;
const {slugify, slugifyArray} = require('../../utils').arrayUtil;

// import platformConfig from src/config/platform.config.js
const { StoryType } = require('../../configs').platformConfig;

/**
 * @name validateStory
 * @function validateStory
 * @description a validator function that validates story data before being passed to the controllers or middlewares
 * @param {Object} data - The story data object
 * @returns {Object} data - The validated story data object and error if any
*/
const validateStory = async data => {
  try {
    // Check if the data mandatory fields are present
    if (!data.kind || !data.content || typeof data.kind !== 'string' || typeof data.content !== 'string') {
      return {
        data: null,
        error: new Error('Kind and content are required and should be strings')
      };
    }

    // Check if the data kind is valid: check against the StoryType array
    if (!StoryType.includes(data.kind)) {
      return {
        data: null,
        error: new Error('Invalid story kind - type not supported')
      };
    }

    let topics = [];

    // Check if the topics array is present and is an array
    if (data.topics && !Array.isArray(data.topics)) {
      return {
        data: null,
        error: new Error('Topics should be an array')
      };
    }

    // Check if the topics array is present and slugify the array
    if (data.topics) {
      topics = slugifyArray(data.topics);
    }

    // Validate when story type is: story
    if (data.kind === 'story') {
      if (!data.title || !data.slug || typeof data.title !== 'string' || typeof data.slug !== 'string') {
        return {
          data: null,
          error: new Error('Title and slug are required and should be strings')
        };
      }

      const validatedData = {
        kind: data.kind,
        content: await sanitizeInput(data.content),
        title: data.title,
        slug: slugify(data.slug),
        topics: topics,
      }

      return {
        data: validatedData,
        error: null
      };
    }

    // Validate when story type is: poll
    if (data.kind === 'poll') {
      // Check if the data poll is present and is an array of strings
      if (!data.poll || !Array.isArray(data.poll)) {
        return {
          data: null,
          error: new Error('Poll should be an array of strings - text')
        };
      }

      // Create a votes array of the same length as the poll array: and initialize each value to 0
      const votes = data.poll.map(() => 0);

      const validatedData = {
        kind: data.kind,
        content: await sanitizeInput(data.content),
        poll: data.poll,
        votes: votes,
        topics: topics,
      }

      return {
        data: validatedData,
        error: null
      };
    }

    // Validate when story type is: post
    if (data.kind === 'post') {
      const validatedData = {
        kind: data.kind,
        content: await sanitizeInput(data.content),
        topics: topics,
      }

      return {
        data: validatedData,
        error: null
      };
    }

  } catch (error) {
    return {
      data: null,
      error: new Error('An error occurred while validating the data')
    };
  }
}


/**
 * @name validateContent
 * @function validateContent
 * @description a validator function that validates story content before being passed to the controllers or middlewares
 * @param {Object} data - The story content object
 * @returns {String} data - The validated story content object and error if any
*/
const validateContent = async data => {
  try {
    // Check if the content is present
    if (!data.content || typeof data.content !== 'string') {
      return {
        data: null,
        error: new Error('Content body is required and should be a string')
      };
    }

    // Validate the content
    const validatedContent = await sanitizeInput(data.content);

    // Return the validated content
    return {
      data: {
        content: validatedContent
      },
      error: null
    };

  } catch (error) {
    return {
      data: null,
      error: new Error('An error occurred while validating the story/post content')
    };
  }
}

module.exports = {
  validateStory,
  validateContent
}