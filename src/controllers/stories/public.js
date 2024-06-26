// Import find story by hash and by slug
const {
  findStoryBySlugOrHash
} = require('../../queries').storyQueries;

const { actionQueue } = require('../../bull');


/**
 * @controller {get} /t/:slug(:hash) Story
 * @name getStory
 * @description This route will render the story page for the app.
 * @returns Page: Renders story page
*/
const getStory = async (req, res) => {
  //get the params from the request
  let param = req.params.story;

  // get user from the request object
  const user = req.user;

  // convert the story to lowercase
  param = param.toLowerCase();

  // query the database for the story
  const { story, error } = await findStoryBySlugOrHash(param, user.hash);

  // console.log(story)

  // if there is an error, render the error page
  if (error) {
    console.error(error);
    return res.status(500).render('500')
  }

  // if there is no story, render the 404 page
  if (!story) {
    return res.status(404).render('404')
  }

  // add view to update views
  const payload = {
    kind: 'view',
    hashes: {
      target: story.hash,
    },
    action: 'story',
    value: 1,
  };

  // add the job to the queue
  await actionQueue.add('actionJob', payload);

  // add tab to the story object
  story.tab = 'replies';

  res.render('pages/story', {
    data: story
  })
}

/**
 * @controller {get} /t/:slug(:hash) Story
 * @name getStoryLikes
 * @description This route will render the story page for the app.
 * @returns Page: Renders story page
*/
const getStoryLikes = async (req, res) => {
  //get the params from the request
  let param = req.params.story;

  // get user from the request object
  const user = req.user;

  // convert the story to lowercase
  param = param.toLowerCase();

  // query the database for the story
  const { story, error } = await findStoryBySlugOrHash(param, user.hash);

  // if there is an error, render the error page
  if (error) {
    console.error(error);
    return res.status(500).render('500')
  }

  // if there is no story, render the 404 page
  if (!story) {
    return res.status(404).render('404')
  }

  // add view to update views
  const payload = {
    kind: 'view',
    hashes: {
      target: story.hash,
    },
    action: 'story',
    value: 1,
  };

  // add the job to the queue
  await actionQueue.add('actionJob', payload);

  // add tab to the story object
  story.tab = 'likes';

  res.render('pages/story', {
    data: story
  })
}



// Export all public content controllers
module.exports = {
  getStory, getStoryLikes
}