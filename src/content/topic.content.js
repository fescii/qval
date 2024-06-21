// Import find topic by hash and by slug
const {
  findTopicBySlugOrHash
} = require('../queries').topicQueries;


/**
 * @controller {get} /t/:slug(:hash) Topic
 * @name getTopic
 * @description This route will render the topic page for the app.
 * @returns Page: Renders topic page
*/
const getTopic = async (req, res) => {
  //get the params from the request
  let param = req.params.topic;

  // convert the topic to lowercase
  param = param.toLowerCase();

  // query the database for the topic
  const { topic, error } = await findTopicBySlugOrHash(param);

  // if there is an error, render the error page
  if (error) {
    console.error(error);
    return res.status(500).render('500')
  }

  // if there is no topic, render the 404 page
  if (!topic) {
    return res.status(404).render('404')
  }

  // add tab to the topic object
  topic.tab = 'article';

  res.render('pages/topic', {
    data: topic
  })
}


// Export all public content controllers
module.exports = {
  getTopic
}