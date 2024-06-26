const { sanitizeUtil } = require('../utils');
const { slugifyArray, slugify } = require('../utils').arrayUtil;
const { StoryType } = require('../configs').platformConfig;

/**
 * @name validateStoryData
 * @function validateStoryData
 * @description a function that validates story data before being passed to the controllers or middlewares
 * @param {Object} data - The story data object
 * @returns {Object} - The validated story data object
*/
const validateStoryData = async (data) => {

  // Check if all fields are provided
  if (!data.kind || !data.content || !data.topics) {
    return {
      data: null,
      error: new Error("Missing fields, make sure you provide all the fields required!")
    }
  }

  // Check if story kind is valid
  if (!StoryType.includes(data.kind)) {
    return {
      data: null,
      error: new Error("Invalid story kind, make sure you provide a valid story kind!")
    }
  }

  // Check if content is a string and is at least 2 chars long
  if (typeof data.content !== 'string' || data.content.length < 2) {
    return {
      data: null,
      error: new Error("Content should be a string, should be at least 2 chars long!")
    }
  }

  // Check if topics is an array and has at least one topic
  if (!Array.isArray(data.topics) || data.topics.length < 1) {
    return {
      data: null,
      error: new Error("Topics should be an array and should have at least one topic!")
    }
  }

  // Slugify topics
  const topics = slugifyArray(data.topics);


  // Check if the story is of kind === post
  if (data.kind === 'post') {

    // Create post data object
    const validatedData = {
      content: await sanitizeUtil.sanitizeInput(data.content),
      topics: topics,
      kind: data.kind
    }

    // Return validated data
    return { data: validatedData, error: null };
  }
  else {

    // Check if all fields for story are provided
    if (!data.title && !data.body && !data.slug) {
      return {
        data: null,
        error: new Error("Missing fields, make sure you provide all the fields required!")
      }
    }

    // Check if title is a string and is at least 5 chars long
    if (typeof data.title !== 'string' || data.title.length < 5) {
      return {
        data: null,
        error: new Error("Title should be a string and should be at least 5 chars long!")
      }
    }

    // check if body is a string and is at least 30 chars long
    if (typeof data.body !== 'string' || data.body < 30) {
      return {
        data: null,
        error: new Error("Body should be a string and should be at least 30 chars long!")
      }
    }

    // check if slug is a string and is at least 5 chars long
    if (typeof data.slug !== 'string' || data.slug < 5) {
      return {
        data: null,
        error: new Error("Slug should be a string and should be at least 5 chars long!!")
      }
    }

    // Slugify the slug
    const slug_data = slugify(data.slug);

    // Create story data object
    const validatedData = {
      title: await sanitizeUtil.sanitizeInput(data.title),
      content: await sanitizeUtil.sanitizeInput(data.content),
      body: await sanitizeUtil.sanitizeInput(data.body),
      topics: topics,
      kind: data.kind,
      slug: slug_data
    }

    // Return validated data
    return { data: validatedData, error: null };
  }
}

/**
 * @name validateStoryContent
 * @function validateStoryContent
 * @description a function that validates story content before being passed to the controllers or middlewares
 * @param {Object} data - The story content object
 * @returns {Object} validatedData - The validated story content object
*/
const validateStoryContent = async (data) => {

  // Check if content field is provided
  if(!data.content) {
    return {
      data: null,
      error: new Error("Missing fields, make sure you provide all the fields required!")
    }
  }

  // Check if content is a string and is at least 3 chars long
  if (typeof data.content !== 'string' || data.content.length < 3) {
    return {
      data: null,
      error: new Error("Content should be a string and should be at least 3 chars long!")
    };
  }

  // Return data if all fields are valid
  return {
    data: {
      content: await sanitizeUtil.sanitizeInput(data.content)
    },
    error: null
  };
}


/**
 * @name validateStoryBody
 * @function validateStoryBody
 * @description a function that validates story body before being passed to the controllers or middlewares
 * @param {Object} data - The story body object
 * @returns {Object} validatedData - The validated story body object
*/
const validateStoryBody = async (data) => {

  // Check if body field is provided
  if (!data.kind || !data.body ) {
    return {
      data: null,
      error: new Error("Missing fields, make sure you provide all the fields required!")
    }
  }

  // Check if story kind is valid
  if (!StoryType.includes(data.kind)) {
    return {
      data: null,
      error: new Error("Invalid story kind, make sure you provide a valid story kind!")
    }
  }

  // Check if story kind is neither 'post' nor 'poll'
  if (data.kind === 'post' || data.kind === 'poll') {
    return {
      data: null,
      error: new Error("Invalid story kind, make sure you provide a valid story kind!")
    }
  }

  // Check if body is a string and is at least 30 chars long
  if (typeof data.body !== 'string' || data.body.length < 30) {
    return {
      data: null,
      error: new Error("Body should be a string and should be at least 30 chars long!")
    };
  }

  // Return data if all fields are valid
  return {
    data: {
      kind: data.kind,
      body: await sanitizeUtil.sanitizeInput(data.body)
    },
    error: null
  };
}


/**
 * @name validateStoryTitle
 * @function validateStoryTitle
 * @description a function that validates story title before being passed to the controllers or middlewares
 * @param {Object} data - The story title object
 * @returns {Object} validatedData - The validated story title object
*/
const validateStoryTitle = async (data) => {

  // Check if title field is provided
  if (!data.title || !data.kind) {
    return {
      data: null,
      error: new Error("Missing fields, make sure you provide all the fields required!")
    }
  }

  // Check if story kind is valid
  if (!StoryType.includes(data.kind)) {
    return {
      data: null,
      error: new Error("Invalid story kind, make sure you provide a valid story kind!")
    }
  }

  // Check if story kind is neither 'post' nor 'poll'
  if (data.kind === 'post' || data.kind === 'poll') {
    return {
      data: null,
      error: new Error("Invalid story kind, make sure you provide a valid story kind!")
    }
  }

  // Check if title is a string and is at least 5 chars long
  if (typeof data.title !== 'string' || data.title.length < 5) {
    return {
      data: null,
      error: new Error("Title should be a string and should be at least 5 chars long!")
    };
  }

  // Return data if all fields are valid
  return {
    data: {
      kind: data.kind,
      title: await sanitizeUtil.sanitizeInput(data.title)
    },
    error: null
  };
}

/**
 * @name validateStorySlug
 * @function validateStorySlug
 * @description a function that validates story slug before being passed to the controllers or middlewares
 * @param {Object} data - The story slug object
 * @returns {Object} validatedData - The validated story slug object
*/
const validateStorySlug = async (data) => {

  // Check if slug field is provided
  if (!data.slug || !data.kind) {
    return {
      data: null,
      error: new Error("Missing fields, make sure you provide all the fields required!")
    }
  }

  // Check if story kind is valid
  if (!StoryType.includes(data.kind)) {
    return {
      data: null,
      error: new Error("Invalid story kind, make sure you provide a valid story kind!")
    }
  }

  // Check if story kind is neither 'post' nor 'poll'
  if (data.kind === 'post' || data.kind === 'poll') {
    return {
      data: null,
      error: new Error("Invalid story kind, make sure you provide a valid story kind!")
    }
  }

  // Check if slug is a string and is at least 5 chars long
  if (typeof data.slug !== 'string' || data.slug.length < 5) {
    return {
      data: null,
      error: new Error("Slug should be a string and should be at least 5 chars long!")
    };
  }

  // Slugify the slug
  const slug_data = slugify(data.slug);

  // Return data if all fields are valid
  return {
    data: {
      kind: data.kind,
      slug: slug_data
    },
    error: null
  };
}

/**
 * @name validateStoryTopics
 * @function validateStoryTopics
 * @description a function that validates story topics before being passed to the controllers or middlewares
 * @param {Object} data - The story topics object
 * @returns {Object} validatedData - The validated story topics object
*/
const validateStoryTopics = async (data) => {

  // Check if topics field is provided
  if (!data.topics) {
    return {
      data: null,
      error: new Error("Missing fields, make sure you provide all the fields required!")
    }
  }

  // Check if topics is an array and has at least one topic
  if (!Array.isArray(data.topics) || data.topics.length < 1) {
    return {
      data: null,
      error: new Error("Topics should be an array and should have at least one topic!")
    }
  }

  // Slugify topics
  const topics = slugifyArray(data.topics);

  // Return data if all fields are valid
  return {
    data: {
      topics: topics
    },
    error: null
  };
}


// Export the module
module.exports = {
  validateStoryData, validateStoryContent, validateStoryBody,
  validateStoryTitle, validateStorySlug, validateStoryTopics
}