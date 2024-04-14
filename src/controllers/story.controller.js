const { addStory } = require('../queries').storyQueries;

const createStory = async (req, res, next) => {
  // Check if the user or payload is available
  if (!req.story_data || !req.user) {
    const error = new Error('Payload data or user data is undefined!');
    return next(error)
  }

  // Get validated payload and user data from request object
  const data = req.story_data;
  const userId = req.user.id;


  // Add story to the database
  const {
    story,
    error
  } = await addStory(userId, data);

  // Passing the error to error middleware
  if (error) {
    return next(error);
  }

  // Return the response
  return res.status(201).send({
    success: true,
    story: story,
    message: "Story was added successfully!",
  });
}

module.exports = {
  createStory
}