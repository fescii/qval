// Import find topic by hash and by slug
const {
  getUserByHash
} = require('../queries').userQueries;


/**
 * @controller {get} /t/:slug(:hash) Topic
 * @name getPerson
 * @description This route will the user page for the app.
 * @returns Page: Renders user page
*/
const getPerson = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  // get user from the request object
  const currentUser = req.user;

  // convert the user hash to lowercase
  param = param.toUpperCase();

  // query the database for the user
  const { user, error } = await getUserByHash(param, currentUser.hash);

  // if there is an error, render the error page
  if (error) {
    console.error(error);
    return res.status(500).render('500')
  }

  // if there is no user, render the 404 page
  if (!user) {
    return res.status(404).render('404')
  }

  // add tab to the user object
  user.tab = 'stories';

  res.render('pages/user', {
    data: user
  })
}

/**
 * @controller {get} /t/:slug(:hash) Topic
 * @name getUserReplies
 * @description This route will the user page for the app.
 * @returns Page: Renders user page
*/
const getUserReplies = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  // get user from the request object
  const currentUser = req.user;

  // convert the user hash to lowercase
  param = param.toUpperCase();

  // query the database for the user
  const { user, error } = await getUserByHash(param, currentUser.hash);

  // if there is an error, render the error page
  if (error) {
    console.error(error);
    return res.status(500).render('500')
  }

  // if there is no user, render the 404 page
  if (!user) {
    return res.status(404).render('404')
  }

  // add tab to the user object
  user.tab = 'replies';

  res.render('pages/user', {
    data: user
  })
}

/**
 * @controller {get} /t/:slug(:hash) Topic
 * @name getUserFollowers
 * @description This route will the user page for the app.
 * @returns Page: Renders user page
*/
const getUserFollowers = async (req, res) => {
  //get the params from the request
  let param = req.params.hash;

  // get user from the request object
  const currentUser = req.user;

  // convert the user hash to lowercase
  param = param.toUpperCase();

  // query the database for the user
  const { user, error } = await getUserByHash(param, currentUser.hash);

  // if there is an error, render the error page
  if (error) {
    console.error(error);
    return res.status(500).render('500')
  }

  // if there is no user, render the 404 page
  if (!user) {
    return res.status(404).render('404')
  }

  // add tab to the user object
  user.tab = 'followers';

  res.render('pages/user', {
    data: user
  })
}


// Export all public content controllers
module.exports = {
  getPerson, getUserReplies, getUserFollowers
}