// Import sanitizeUtil from src/utils/sanitize.util.js
const { sanitizeInput } = require('../../utils').sanitizeUtil;
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

    // check if published is present and is a boolean: if not set it
    if (!data.published || typeof data.published !== 'boolean') {
      data.published = false;
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
        published: data.published,
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
      if (!data.poll || !Array.isArray(data.poll) || !data.poll.every(item => typeof item === 'string') || !data.end || typeof data.end !== 'number') {
        return {
          data: null,
          error: new Error('Missing (poll, end) or poll is not an array of strings or end is not a number')
        };
      }

      // Poll cannot be more than 4 options
      if (data.poll.length > 4) {
        return {
          data: null,
          error: new Error('Poll cannot have more than 4 options')
        };
      }

      // end cannot be more than 7 days
      if (data.end > 7) {
        return {
          data: null,
          error: new Error('Poll cannot run for more than 7 days')
        };
      }

      // the end containst the number of days the poll will run for: convert it to date compatible with sequelize
      const now = new Date(Date.now());

      // add the number of days to the current date
      now.setDate(now.getDate() + data.end);


      // Create a votes array of the same length as the poll array: and initialize each value to 0
      const votes = data.poll.map(() => 0);

      const validatedData = {
        kind: data.kind,
        published: data.published,
        content: await sanitizeInput(data.content),
        poll: data.poll,
        votes: votes,
        topics: topics,
        end: now
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
        published: data.published,
        content: await sanitizeInput(data.content),
        topics: topics,
      }

      return {
        data: validatedData,
        error: null
      };
    }

  } catch (error) {
    console.log(error);
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

/**
 * @function validateSlug
 * @description a validator function that validates story slug before being passed to the controllers or middlewares
 * @param {Object} data - The story data object
 * @returns {String} slug - The validated story slug and error if any
*/
const validateSlug = async data => {
  try {
    // Check if the slug is present
    if (!data.slug || typeof data.slug !== 'string') {
      return {
        slug: null,
        error: new Error('Slug is required and should be a string')
      };
    }

    // Validate the slug
    const validatedSlug = slugify(data.slug);

    // Return the validated slug
    return {
      data: {
        slug: await sanitizeInput(validatedSlug)
      },
      error: null
    };

  } catch (error) {
    return {
      slug: null,
      error: new Error('An error occurred while validating the story slug')
    };
  }
}

/**
 * @validate validateTitle
 * @description a function that validates the story title
 * @param {Object} data - The story title
 * @returns {Object} data - The validated story title and error if any
*/
const validateTitle = async data => {
  try {
    // Check if the title is present
    if (!data.title || typeof data.title !== 'string') {
      return {
        title: null,
        error: new Error('Title is required and should be a string')
      };
    }

    // Return the validated title
    return {
      data: {
        title: await sanitizeInput(data.title)
      },
      error: null
    };

  } catch (error) {
    return {
      title: null,
      error: new Error('An error occurred while validating the story title')
    };
  }
}

module.exports = {
  validateStory, validateTitle,
  validateContent, validateSlug
}