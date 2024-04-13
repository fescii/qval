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

module.exports =  {
  newStoryData
}