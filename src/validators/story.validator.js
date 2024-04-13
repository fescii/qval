const { sanitizeUtil } = require('../utils')

// Register data validation
const validateStoryData = async (data) => {
  if (!story.kind && !story.content && !story.topics) {
    return {
      data: null,
      error: new Error("Missing fields, make sure you provide all the fields required!")
    }
  }

  // Check if the story is of kind === post
  if (data.kind === 'post') {
    if (data.content && data.topics) {
      // validate first name
      if (typeof data.content !== 'string' || data.content.length < 2) {
        return {
          data: null,
          error: new Error("Post content should have 2 chars or more and must be a string!")
        }
      }

      // validate last name
      if (typeof data.topics !== 'string' || data.topics.length < 2) {
        return {
          data: null,
          error: new Error("Post topics should have 2 chars or more and must be a string!")
        }
      }

      const validatedData = {
        content: await sanitizeUtil.sanitizeInput(data.content),
        topics: await sanitizeUtil.sanitizeInput(data.topics),
        kind: data.kind
      }

      return { data: validatedData, error: null };
    }
    else {
      return {
        data: null,
        error: new Error("Some fields were not provided or contains null values, Ensure you provide: (content, topics)")
      }
    }
  }

  if (data.kind === 'story' || data.kind === 'article' || data.kind === 'story') {
    if (data.title && data.body && data.topic) {
      // validate first name
      if (typeof data.title !== 'string' || data.title.length < 2) {
        return {
          data: null,
          error: new Error("Story title should have 2 chars or more and must be a string!")
        }
      }

      // validate last name
      if (typeof data.body !== 'string' || data.body < 30) {
        return {
          data: null,
          error: new Error("Story body should have 30 chars or more and must be a string!")
        }
      }

      // validate last name
      if (typeof data.topic !== 'string' || data.topic < 2) {
        return {
          data: null,
          error: new Error("Story topic should have 2 chars or more and must be a string!")
        }
      }

      const slug_data = await sanitizeUtil.sanitizeInput(data.title);

      const validatedData = {
        title: await sanitizeUtil.sanitizeInput(data.title),
        body: await sanitizeUtil.sanitizeInput(data.body),
        topic: await sanitizeUtil.sanitizeInput(data.topic),
        kind: data.kind,
        slug: slug_data.trim().replace(/\s+/g, ' ').
          toLowerCase().replace(/\s+/g, '-'),
      }

      return { data: validatedData, error: null };
    }
    else {
      return {
        data: null,
        error: new Error("Some fields were not provided or contains null values, Ensure you provide: (title, body, topic)")
      }
    }

  }
}

module.exports = {
  validateStoryData
}