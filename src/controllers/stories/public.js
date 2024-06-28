// Import find story by hash and by slug
const {
  findStoryBySlugOrHash, findReplyByHash
} = require('../../queries').storyQueries;

const { actionQueue } = require('../../bull');


/**
 * @controller {get} /p/:slug(:hash) Story
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

  if (story.kind === 'story') {
    story.html = mapFields(story.content, story.story_sections);
  }

  res.render('pages/story', {
    data: story
  })
}

/**
 * @controller {get} /p/:slug(:hash) Story
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

  if (story.kind === 'story') {
    story.html = mapFields(story.content, story.story_sections);
  }

  res.render('pages/story', {
    data: story
  })
}

const mapFields = (content, data) => {
  let html = `
    <div class="intro">
      ${content}
    </div>
  `;
  
  if (data.length <= 0) {
    return html;
  }
  else {
    const sections =  data.map(section => {
      const title = section.title !== null ? `<h2 class="title">${section.title}</h2>` : '';
      return /*html*/`
        <div class="section" order="${section.order}" id="section${section.order}">
          ${title}
          ${section.content}
        </div>
      `
    }).join('');

    return `${html} ${sections}`;
  }
}

/**
 * @controller {get} /r/:hash) Reply
 * @name getReply
 * @description - A controller to render the reply page
 * @returns Page: Renders reply page
*/
const getReply = async (req, res) => {
  //get the params from the request
  let {hash} = req.params;

  // get user from the request object
  const user = req.user;

  // query the database for the reply
  const { reply, error } = await findReplyByHash(hash.toUpperCase(), user.hash);

  // if there is an error, render the error page
  if (error) {
    console.error(error);
    return res.status(500).render('500')
  }

  // if there is no reply, render the 404 page
  if (!reply) {
    return res.status(404).render('404')
  }

  // add view to update views
  const payload = {
    kind: 'view',
    hashes: {
      target: reply.hash,
    },
    action: 'reply',
    value: 1,
  };

  // add the job to the queue
  await actionQueue.add('actionJob', payload);

  // add tab to the reply object
  reply.tab = 'replies';

  res.render('pages/reply', {
    data: reply
  })
}

/**
 * @controller {get} /r/:hash) Reply Likes
 * @name getReplyLikes
 * @description - A controller to render the reply page
 * @returns Page: Renders reply page
*/
const getReplyLikes = async (req, res) => {
  //get the params from the request
  let {hash} = req.params;

  // get user from the request object
  const user = req.user;

  // query the database for the reply
  const { reply, error } = await findReplyByHash(hash.toUpperCase(), user.hash);

  // if there is an error, render the error page
  if (error) {
    console.error(error);
    return res.status(500).render('500')
  }

  // if there is no reply, render the 404 page
  if (reply) {
    return res.status(404).render('404')
  }

  // add view to update views
  const payload = {
    kind: 'view',
    hashes: {
      target: reply.hash,
    },
    action: 'reply',
    value: 1,
  };

  // add the job to the queue
  await actionQueue.add('actionJob', payload);

  // add tab to the reply object
  reply.tab = 'likes';

  res.render('pages/reply', {
    data: reply
  })
}



// Export all public content controllers
module.exports = {
  getStory, getStoryLikes, getReply, getReplyLikes
}