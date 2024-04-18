
/**
 * Function to get required data based on the kind of story
 * @function newStoryData
 * @typedef {Object} StoryData
 * @param {string} userId - The user id
 * @param {Object} data - The data to be validated
 * @returns {Object} - Returns the data object
*/
const newStoryData = async (userId, data) => {
  switch (data.kind) {
    case 'post':
      return {
        kind: data.kind,
        content: data.content,
        author: userId,
        topics: data.topics
      }
    default:
      return {
        title: data.title,
        kind: data.kind,
        content: data.content,
        author: userId,
        body: data.body,
        topics: data.topics,
        slug: data.slug
      }
  }
}

/**
 * Exporting the functions as a single object
*/
module.exports =  {
  newStoryData
}