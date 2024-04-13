const { sanitizeUtil } = require('../utils');
const { slugifyArray, slugify } = require('../utils').arrayUtil;

// Register data validation
const validateStoryData = async (data) => {
  if (!story.kind && !story.content && !story.topics) {
    return {
      data: null,
      error: new Error("Missing fields, make sure you provide all the fields required!")
    }
  }

  // validate content
  if (typeof data.content !== 'string' || data.content.length < 2) {
    return {
      data: null,
      error: new Error("Content should be a string, should be at least 2 chars long!")
    }
  }

  // validate topics
  if (!Array.isArray(data.topics) || data.topics.length < 1) {
    return {
      data: null,
      error: new Error("Topics should be an array and should have at least one topic!")
    }
  }

  const topics = await slugifyArray(data.topics);

  // Check if the story is of kind === post
  if (data.kind === 'post') {

    const validatedData = {
      content: await sanitizeUtil.sanitizeInput(data.content),
      topics: topics,
      kind: data.kind
    }

    return { data: validatedData, error: null };
  }
  else {
    if (!data.title && !data.body && !data.slug) {
      return {
        data: null,
        error: new Error("Missing fields, make sure you provide all the fields required!")
      }
    }

    if (typeof data.title !== 'string' || data.title.length < 5) {
      return {
        data: null,
        error: new Error("Title should be a string and should be at least 5 chars long!")
      }
    }

    // validate last name
    if (typeof data.body !== 'string' || data.body < 30) {
      return {
        data: null,
        error: new Error("Body should be a string and should be at least 30 chars long!")
      }
    }

    // validate last name
    if (typeof data.slug !== 'string' || data.slug < 6) {
      return {
        data: null,
        error: new Error("Slug should be a string and should be at least 6 chars long!!")
      }
    }

    const slug_data = await slugify(data.slug);

    const validatedData = {
      title: await sanitizeUtil.sanitizeInput(data.title),
      content: await sanitizeUtil.sanitizeInput(data.content),
      body: await sanitizeUtil.sanitizeInput(data.body),
      topics: topics,
      kind: data.kind,
      slug: slug_data
    }

    return { data: validatedData, error: null };
  }
}

module.exports = {
  validateStoryData
}